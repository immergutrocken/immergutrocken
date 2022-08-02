import { useState, useEffect } from "react";
import { useDocumentOperation, useValidationStatus } from "@sanity/react-hooks";
import { slugify } from "../schemas/fields/slug";

export default function igPublishAction(props) {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const { isValidating, markers } = useValidationStatus(props.id, props.type);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isPublishing && !props.draft) setIsPublishing(false);
  }, [props.draft]);

  return {
    disabled: publish.disabled || isValidating || markers.length !== 0,
    label: isPublishing ? "Publishing..." : "Publish",
    onHandle: async () => {
      setIsPublishing(true);
      if (
        (props.type === "article" || props.type === "artist") &&
        props.draft.slug?.current === ""
      ) {
        const slugifiedTitle = await slugify({
          title: props.draft.languages.de.title,
          id: props.id,
          type: props.type,
        });
        patch.execute([
          {
            set: {
              slug: {
                _type: "slug",
                current: slugifiedTitle,
              },
            },
          },
        ]);
      }
      publish.execute();
      props.onComplete();
    },
  };
}
