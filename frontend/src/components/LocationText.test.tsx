import renderer from "react-test-renderer";
import LocationText from "./LocationText";

test("it renders location provided", () => {
  const component = renderer.create(<LocationText location="Building" />);

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("it renders link if provided", () => {
  const component = renderer.create(
    <LocationText location="Building" link="https://google.com" />
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
