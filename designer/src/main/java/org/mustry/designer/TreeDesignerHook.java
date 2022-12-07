package org.mustry.designer;

import com.inductiveautomation.ignition.common.BundleUtil;
import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.designer.model.AbstractDesignerModuleHook;
import com.inductiveautomation.ignition.designer.model.DesignerContext;
import com.inductiveautomation.perspective.designer.DesignerComponentRegistry;
import com.inductiveautomation.perspective.designer.api.ComponentDesignDelegateRegistry;
import com.inductiveautomation.perspective.designer.api.PerspectiveDesignerInterface;
import org.mustry.common.component.display.Tree;

public class TreeDesignerHook extends AbstractDesignerModuleHook {
    private static final LoggerEx logger = LoggerEx.newBuilder().build("TreeComponents");

    private DesignerContext context;
    private DesignerComponentRegistry registry;
    private ComponentDesignDelegateRegistry delegateRegistry;

    static {
        BundleUtil.get().addBundle("treecomponents", TreeDesignerHook.class.getClassLoader(), "treecomponents");
    }

    public TreeDesignerHook() {
        logger.info("Registering Tree Components in Designer");
    }

    @Override
    public void startup(DesignerContext context, LicenseState activationState) {
        this.context = context;
        init();
    }

    private void init() {
        logger.debug("Initializing registry entrants...");

        PerspectiveDesignerInterface pdi = PerspectiveDesignerInterface.get(context);

        registry = pdi.getDesignerComponentRegistry();
        delegateRegistry = pdi.getComponentDesignDelegateRegistry();

        // register components to get them on the palette
        registry.registerComponent(Tree.DESCRIPTOR);
    }


    @Override
    public void shutdown() {
        removeComponents();
    }

    private void removeComponents() {
        registry.removeComponent(Tree.COMPONENT_ID);
    }
}
