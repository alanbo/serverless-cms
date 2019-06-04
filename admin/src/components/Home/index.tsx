import gql from 'graphql-tag';
import { graphql, compose, ChildDataProps, MutationFn } from "react-apollo";
import Home from './Home';

export const renderPagesMutation = gql`
  mutation RenderPages {
    success: renderPages
  }
`;

export const publishMutation = gql`
  mutation Publish {
    success: publish
  }
`;

interface MutationResponse {
  success: boolean | null
}


// type RenderPagesChildProps = ChildDataProps<{}, MutationResponse>;
interface RenderPagesChildProps {
  renderPages: MutationFn<MutationResponse>

}

interface PublishChildProps {
  publish: MutationFn<MutationResponse>
}


export default compose(
  graphql<{}, MutationResponse, {}, RenderPagesChildProps>(renderPagesMutation, {
    props: props => ({
      renderPages: props.mutate!
    })
  }),
  graphql<{}, MutationResponse, {}, PublishChildProps>(publishMutation, {
    props: props => ({
      publish: props.mutate!
    })
  })
)(Home)