import java.util.Date
import java.text.SimpleDateFormat

plugins {
    base
    // the ignition module plugin: https://github.com/inductiveautomation/ignition-module-tools
    id("io.ia.sdk.modl") version("0.1.1")
    id("org.barfuin.gradle.taskinfo") version "1.3.0"
}

var timestamp = SimpleDateFormat("yyyyMMddHH").format(Date())

allprojects {
    version = "1.0.2"
    group = "org.mustry"
}

ignitionModule {
    // name of the .modl file to build
    fileName.set("Mustry_UI")

    // module xml configuration
    name.set("Mustry UI")
    id.set("org.mustry.mustryui")
    moduleVersion.set("${project.version}.${timestamp}")
    moduleDescription.set("A compilation of components made by Mustry Solutions.")
    requiredIgnitionVersion.set("8.1.8")

    freeModule.set(true)

    // If we depend on other module being loaded/available, then we specify IDs of the module we depend on,
    // and specify the Ignition Scope that applies. "G" for gateway, "D" for designer, "C" for VISION client
    // (this module does not run in the scope of a Vision client, so we don't need a "C" entry here)
    moduleDependencies.put("com.inductiveautomation.perspective", "DG")

    // map of 'Gradle Project Path' to Ignition Scope in which the project is relevant.  This is is combined with
    // the dependency declarations within the subproject's build.gradle.kts in order to determine which
    // dependencies need to be bundled with the module and added to the module.xml.
    projectScopes.putAll(
        mapOf(
            ":gateway" to "G",
            ":web" to "G",
            ":designer" to "D",
            ":common" to "GD"
        )
    )

    // 'hook classes' are the things that Ignition loads and runs when your module is installed.  This map tells
    // Ignition which classes should be loaded in a given scope.
    hooks.putAll(
        mapOf(
            "org.mustry.gateway.MustryUIGatewayHook" to "G",
            "org.mustry.designer.MustryUIDesignerHook" to "D"
        )
    )

    /*
     * Optional unsigned modl settings. If true, modl signing will be skipped. This is not for production and should
     * be used merely for development testing
     */
    skipModlSigning.set(false)
}

val deepClean by tasks.registering {
    dependsOn(allprojects.map { "${it.path}:clean" })
    description = "Executes clean tasks and remove node plugin caches."
    doLast {
        delete(file(".gradle"))
    }
}
