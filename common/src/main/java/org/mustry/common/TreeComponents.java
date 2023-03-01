package org.mustry.common;

import java.util.Set;

import com.inductiveautomation.perspective.common.api.BrowserResource;

public class TreeComponents {
    public static final String MODULE_ID = "org.mustry.trees";
    public static final String URL_ALIAS = "treecomponents";
    public static final String COMPONENT_CATEGORY = "Tree Components";
    public static final Set<BrowserResource> BROWSER_RESOURCES =
        Set.of(
            new BrowserResource(
                "tree-components-js",
                String.format("/res/%s/TreeComponents.js", URL_ALIAS),
                BrowserResource.ResourceType.JS
            ),
            new BrowserResource(
                "tree-components-css",
                String.format("/res/%s/TreeComponents.css", URL_ALIAS),
                BrowserResource.ResourceType.CSS
            )
        );
}
