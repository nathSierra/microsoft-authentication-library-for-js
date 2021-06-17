import { Component } from "react";

// Msal imports
import { MsalAuthenticationTemplate, withMsal } from "@azure/msal-react";
import { InteractionType, InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import {ReactQueryDevtools} from 'react-query/devtools';
import {
    QueryClient,
   QueryClientProvider,
   useQuery
 } from 'react-query'

// Sample app imports
import { ProfileData } from "../ui-components/ProfileData";
import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { callMsGraph, getJobs } from "../utils/MsGraphApiCall";

// Material-ui imports
import Paper from "@material-ui/core/Paper";

function UseQuery (props) {
  return props.children(useQuery(props.keyName, props.queryFn, props.options))
}


/**
 * This class is a child component of "Profile". MsalContext is passed
 * down from the parent and available as a prop here.
 */
class ProfileContent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            graphData: null,
            jobData: null
        }
    }

        callJobs = () => {
        getJobs().then(response => this.setState({jobData: response.result}))
    }



    readState = () => {
        console.info(this.state.jobData);
    }

    componentDidMount() {
        if (!this.state.graphData && this.props.msalContext.inProgress === InteractionStatus.None) {
            callMsGraph().then(response => this.setState({graphData: response}));
        }
    }



    render() {
        return (
            <Paper>
                {/* <button onClick={() => this.callJobs()}>HEYI</button> */}
                {/* <button onClick={() => this.readState()}>Read state</button> */}
                <UseQuery
                    keyName="jobs"
                    queryFn={() => getJobs().then((result) => result.json()).then((responseData) => responseData.result)}
                    options={{ staleTime: 100000 }}
                >
                    {({data, isLoading}) => {
                        if (isLoading) return <h1>Loading</h1>;
                        return <div>
                            <h1>Hello</h1>
                        </div>
                    }}

                </UseQuery>
                {/* { this.state.jobData ? <ul>
                    {this.state.jobData.map(job => <li key={job.id}>{job.status}</li>)}
                </ul> : null} */}
                {/* { this.state.graphData ? <ProfileData graphData={this.state.graphData} /> : null } */}
            </Paper>
        );
    }
}

/**
 * This class is using "withMsal" HOC and has access to authentication
 * state. It passes down the msalContext as a prop to its children.
 */
class Profile extends Component {

    render() {
        const queryClient = new QueryClient();
        const authRequest = {
            ...loginRequest
        };


        return (

            <QueryClientProvider client={queryClient}>
                <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
            errorComponent={ErrorComponent}
            loadingComponent={Loading}
            >                <ProfileContent msalContext={this.props.msalContext}/>
        </MsalAuthenticationTemplate>
<ReactQueryDevtools initialIsOpen={false} />
     </QueryClientProvider>


        );
    }
}

// Wrap your class component to access authentication state as props
export const ProfileWithMsal = withMsal(Profile);
