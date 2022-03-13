import renderer from 'react-test-renderer';
import CapacityText from './CapacityText';

test('CapacityText correctly shows the number the current number of joined users and spots available', () => {
    const component = renderer.create(<CapacityText num_users={10} capacity={60} />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})