import defaultResolve, {
  PublishAction,
} from "part:@sanity/base/document-actions";
import igPublishAction from "./igPublishAction";

export default function resolveDocumentActions(props) {
  return defaultResolve(props).map((Action) =>
    Action === PublishAction ? igPublishAction : Action
  );
}
