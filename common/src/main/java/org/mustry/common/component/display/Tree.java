package org.mustry.common.component.display;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import org.mustry.common.TreeComponents;


/**
 * Describes the component to the Java registry so the gateway and designer know to look for the front end elements.
 * In a 'common' scope so that it's referencable by both gateway and designer.
 */
public class Tree  {

    // unique ID of the component which perfectly matches that provided in the javascript's ComponentMeta implementation
    public static final String COMPONENT_ID = "trees.display.tree";

    /**
     * The schema provided with the component descriptor. Use a schema instead of a plain JsonObject because it gives
     * us a little more type information, allowing the designer to highlight mismatches where it can detect them.
     */
    public static final JsonSchema SCHEMA =
        JsonSchema.parse(TreeComponents.class.getResourceAsStream("/tree.props.json"));

    /**
     * Components register with the Java side ComponentRegistry but providing a ComponentDescriptor.  Here we
     * build the descriptor for this one component. Icons on the component palette are optional.
     */
    public static ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(TreeComponents.COMPONENT_CATEGORY)
        .setId(COMPONENT_ID)
        .setModuleId(TreeComponents.MODULE_ID)
        .setSchema(SCHEMA) //  this could alternatively be created purely in Java if desired
        .setName("Tree")
        .addPaletteEntry("", "Tree", "A simple tree component.", null, null)
        .setDefaultMetaName("Tree")
        .setResources(TreeComponents.BROWSER_RESOURCES)
        .build();

}

