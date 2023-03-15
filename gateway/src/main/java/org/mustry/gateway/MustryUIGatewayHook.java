package org.mustry.gateway;

import java.util.Optional;

import com.inductiveautomation.ignition.common.licensing.LicenseState;
import com.inductiveautomation.ignition.common.util.LoggerEx;
import com.inductiveautomation.ignition.gateway.dataroutes.RouteGroup;
import com.inductiveautomation.ignition.gateway.model.AbstractGatewayModuleHook;
import com.inductiveautomation.ignition.gateway.model.GatewayContext;
import com.inductiveautomation.perspective.common.api.ComponentRegistry;
import com.inductiveautomation.perspective.gateway.api.ComponentModelDelegateRegistry;
import com.inductiveautomation.perspective.gateway.api.PerspectiveContext;
import org.mustry.common.MustryUIComponents;
import org.mustry.common.component.display.BranchingComponent;

public class MustryUIGatewayHook extends AbstractGatewayModuleHook {
    private static final LoggerEx log = LoggerEx.newBuilder().build("mustryui.gateway.MustryUIGatewayHook");

    private GatewayContext gatewayContext;
    private PerspectiveContext perspectiveContext;
    private ComponentRegistry componentRegistry;
    private ComponentModelDelegateRegistry modelDelegateRegistry;

    @Override
    public void setup(GatewayContext context) {
        this.gatewayContext = context;
        log.info("Setting up Mustry UI Module.");
    }

    @Override
    public void startup(LicenseState activationState) {
        log.info("Starting up MustryUIGatewayHook.");

        this.perspectiveContext = PerspectiveContext.get(this.gatewayContext);
        this.componentRegistry = this.perspectiveContext.getComponentRegistry();
        this.modelDelegateRegistry = this.perspectiveContext.getComponentModelDelegateRegistry();


        if (this.componentRegistry != null) {
            log.info("Registering Mustry UI components.");
            this.componentRegistry.registerComponent(BranchingComponent.DESCRIPTOR);
        } else {
            log.error("Reference to component registry not found, Mustry UI Components will fail to function!");
        }
    }

    @Override
    public void shutdown() {
        log.info("Shutting down Mustry UI module and removing registered components.");
        if (this.componentRegistry != null) {
            this.componentRegistry.removeComponent(BranchingComponent.COMPONENT_ID);
        } else {
            log.warn("Component registry was null, could not unregister Mustry UI Components.");
        }
    }

    @Override
    public Optional<String> getMountedResourceFolder() {
        return Optional.of("mounted");
    }

    // Lets us use the route http://<gateway>/res/radcomponents/*
    @Override
    public Optional<String> getMountPathAlias() {
        return Optional.of(MustryUIComponents.URL_ALIAS);
    }

    @Override
    public boolean isFreeModule() {
        return true;
    }
}
