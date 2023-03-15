package org.mustry.common;

import java.util.Set;

import com.inductiveautomation.perspective.common.api.BrowserResource;

public class MustryUIComponents {
    public static final String MODULE_ID = "org.mustry.mustryui";
    public static final String URL_ALIAS = "mustryuicomponents";
    public static final String COMPONENT_CATEGORY = "Mustry UI Components";
    public static final Set<BrowserResource> BROWSER_RESOURCES =
        Set.of(
            new BrowserResource(
                "mustry-ui-components-js",
                String.format("/res/%s/MustryUIComponents.js", URL_ALIAS),
                BrowserResource.ResourceType.JS
            ),
            new BrowserResource(
                "mustry-ui-components-css",
                String.format("/res/%s/MustryUIComponents.css", URL_ALIAS),
                BrowserResource.ResourceType.CSS
            )
        );
}
