package org.mustry.common.component.display;

import com.inductiveautomation.ignition.common.gson.JsonParser;
import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;

import java.io.InputStreamReader;

import javax.swing.ImageIcon;

import org.mustry.common.MustryUIComponents;


/**
 * Describes the component to the Java registry so the gateway and designer know to look for the front end elements.
 * In a 'common' scope so that it's referencable by both gateway and designer.
 */
public class BranchingComponent  {

    // unique ID of the component which perfectly matches that provided in the javascript's ComponentMeta implementation
    public static final String COMPONENT_ID = "mustryui.display.branching";

    /**
     * The schema provided with the component descriptor. Use a schema instead of a plain JsonObject because it gives
     * us a little more type information, allowing the designer to highlight mismatches where it can detect them.
     */
    public static final JsonSchema SCHEMA =
        JsonSchema.parse(MustryUIComponents.class.getResourceAsStream("/branching_component.props.json"));

    /**
     * Components register with the Java side ComponentRegistry but providing a ComponentDescriptor.  Here we
     * build the descriptor for this one component. Icons on the component palette are optional.
     */
    public static ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(MustryUIComponents.COMPONENT_CATEGORY)
        .setId(COMPONENT_ID)
        .setModuleId(MustryUIComponents.MODULE_ID)
        .setSchema(SCHEMA) //  this could alternatively be created purely in Java if desired
        .setName("Branching Component")
        .setIcon(new ImageIcon(MustryUIComponents.class.getResource("/icons/Logo_Small.png")))
        .addPaletteEntry("", "Branching Component", "A component to display a branching path", null, null)
        .addPaletteEntry("example", "Branching Component Example", "An example of how to use the branching component", null, (new JsonParser()).parse(new InputStreamReader(MustryUIComponents.class.getResourceAsStream("/variants/branching_component.example.props.json"))).getAsJsonObject())
        .setDefaultMetaName("Branching Component")
        .setResources(MustryUIComponents.BROWSER_RESOURCES)
        .build();

}

