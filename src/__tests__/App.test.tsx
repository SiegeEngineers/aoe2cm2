import {shallow} from "enzyme";
import * as React from "react";
import App from "../App";

it("renders without crashing", () => {
  shallow(<App />);
});
