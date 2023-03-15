import { ComponentMeta, ComponentRegistry } from '@inductiveautomation/perspective-client';
import { BranchingComponent, BranchingComponentMeta } from './components/branchingComponent/BranchingComponent';

// export so the components are referencable, e.g. `RadComponents['Image']
export { BranchingComponent };

import '../scss/main'

// as new components are implemented, import them, and add their meta to this array
const components: Array<ComponentMeta> = [
    new BranchingComponentMeta()
];

// iterate through our components, registering each one with the registry.  Don't forget to register on the Java side too!
components.forEach((c: ComponentMeta) => ComponentRegistry.register(c) );
