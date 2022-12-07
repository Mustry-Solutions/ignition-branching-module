import { ComponentMeta, ComponentRegistry } from '@inductiveautomation/perspective-client';
import { Tree, TreeMeta } from './components/Tree';

// export so the components are referencable, e.g. `RadComponents['Image']
export { Tree };

// as new components are implemented, import them, and add their meta to this array
const components: Array<ComponentMeta> = [
    new TreeMeta()
];

// iterate through our components, registering each one with the registry.  Don't forget to register on the Java side too!
components.forEach((c: ComponentMeta) => ComponentRegistry.register(c) );
