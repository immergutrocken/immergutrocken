import createSchema from "part:@sanity/base/schema-creator";

import schemaTypes from "all:part:@sanity/base/schema-type";
import article from "./documents/article";
import partner from "./documents/partner";
import menu from "./documents/menu";
import notification from "./documents/notification";
import artist from "./documents/artist";
import sortings from "./documents/sortings";
import verein from "./documents/verein";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    article,
    artist,
    menu,
    partner,
    notification,
    sortings,
    verein,
  ]),
});
