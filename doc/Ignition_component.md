# Ignition component

## prerequisites

### global dependencies

Download eerst npm en Node.js via de volgende website: https://nodejs.org/en/download/.

Of update je node versie `npm install -g npm`.

Installeer dan de volgende dependencies globally:

```cmd
npm install -g yarn
yarn global add typescript
yarn global add webpack
yarn global add tslint
yarn global add lerna
```

### gradle

Download en installeer Java Development Kit **11** (Latere versies zijn niet compatibel): https://www.oracle.com/be/java/technologies/javase/jdk11-archive-downloads.html

> If you have more versions installed you can switch there with this:
```bash
export JAVA_HOME=/usr/local/opt/openjdk@11/bin
export PATH=$JAVA_HOME:$PATH
```


Tutorial voor het installeren: https://docs.oracle.com/cd/E19182-01/821-0917/inst_jdk_javahome_t/index.html.

Download en installeer gradle: https://docs.gradle.org/current/userguide/installation.html#installing_manually.

## Ignition component

Een Ignition perspective module bestaad uit 3 verschillende Java projecten. Een *common*, *designer* en *gateway*. In *common* worden je perspective componenten gedefinieerd en gemaakt. In het *designer* en *gateway* project worden ze dan geregistreerd. Daarnaast heb je nog een project die niet met Java wordt geschreven: *web*. Hierin wordt met lerna een React project gemaakt. Dit is dus het visuele aspect van jouw component.

```
common
designer
gateway
web
```

### gradle start

Gradle is een builder tool om Java applicaties te builden.

1. Run `gradle init`
2. Kies voor de volgende parameters:
   - basic
   - Kotlin

Vanaf de initialisatie mag het `gradle` command niet meer worden gebruikt. Gebruik in de plaats `.\gradlew` of `.\gradlew.bat` voor Windows. Dit is omdat de gradlew file informatie over versioning bevat en dus altijd juist zal worden uitgevoerd. Dit betekend ook dat dit project kan worden gebuild op een andere client zonder dat gradle moet zijn geïnstalleerd.

### basic setup en dependencies

We zullen beginnen met de Ignition dependencies toe te voegen. PAS OP: als er nieuwe versies beschikbaar worden gebruik dan de nieuwe versies.

#### settings.gradle.tks

Hier worden algemene settings van het project gedefinieerd.

1. plugins
   ```kotlin
   pluginManagement {
       repositories {
           gradlePluginPortal()
           mavenCentral()
           mavenLocal()
           // add the IA repo to pull in the module-signer artifact.  Can be removed if the module-signer is maven
           // published locally from its source-code and loaded via mavenLocal.
           maven {
               url = uri("https://nexus.inductiveautomation.com/repository/public/")
           }
       }
   }
   ```

2. dependency resolution
   ```kotlin
   dependencyResolutionManagement {
       repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
   
       repositories {
           mavenLocal()
           maven {
               url = uri("https://nexus.inductiveautomation.com/repository/public/")
           }
   
           // Declare the Node.js download repository.  We do this here so that we can continue to have repositoryMode set
           // to 'PREFER SETTINGS', as the node plugin will respect that and not set the node repo, meaning we can't
           // resolve the node runtime we need for building the web packages.
           ivy {
               name = "Node.js"
               setUrl("https://nodejs.org/dist/")
               patternLayout {
                   artifact("v[revision]/[artifact](-v[revision]-[classifier]).[ext]")
               }
               metadataSources {
                   artifact()
               }
               content {
                   includeModule("org.nodejs", "node")
               }
           }
       }
   }
   ```

3. Voeg ook nog deze setting toe
   `enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")`

#### build.gradle.kts

Elk subproject zal zijn eigen build file.

1. plugins (Specifiek voor Ignition)
   ```kotlin
   plugins {
       base
       // the ignition module plugin: https://github.com/inductiveautomation/ignition-module-tools
       id("io.ia.sdk.modl") version("0.1.1")
       id("org.barfuin.gradle.taskinfo") version "1.3.0"
   }
   ```

2. project settings, increment version wanneer een nieuwe build wordt gemaakt. De group definieerd het pad voor al de Java folder structuur.
   ```kotlin
   allprojects {
       version = "0.0.1"
       group = "org.mustry"
   }
   ```

3. Ignition module (Voor testen en development zet **skipModlSigning** naar **true**)
   ```kotlin
   ignitionModule {
       // name of the .modl file to build
       fileName.set("CoolName")
   
       // module xml configuration
       name.set("CoolName")
       id.set("org.mustry.coolname")
       moduleVersion.set("${project.version}")
       moduleDescription.set("Description.")
       requiredIgnitionVersion.set("8.1.8")
   
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
               "org.mustry.gateway.egGatewayHook" to "G",
               "org.mustry.designer.egDesignerHook" to "D"
           )
       )
   
       /*
        * Optional unsigned modl settings. If true, modl signing will be skipped. This is not for production and should
        * be used merely for development testing
        */
       skipModlSigning.set(true)
   }
   ```

4. Definieer hoe de deepClean gradle command zal werken
   ```kotlin
   val deepClean by tasks.registering {
       dependsOn(allprojects.map { "${it.path}:clean" })
       description = "Executes clean tasks and remove node plugin caches."
       doLast {
           delete(file(".gradle"))
       }
   }
   ```

#### versions

De build files van de subprojecten zullen gebruik maken van deze ignition dependencies. Om makkelijk naar een volgende versie te kunnen te gaan worden deze opgeslaan in een file in `gradle/libs.versions.toml`.

```toml
[versions]
    ignition = "8.1.16"

[libraries]
    # Dependencies provided by the Ignition SDK, they all reference the 'ignition' version
    ignition-alarm-notification-common = { module = "com.inductiveautomation.ignitionsdk:alarm-notification-common", version.ref = "ignition" }
    ignition-alarm-notification-designer = { module = "com.inductiveautomation.ignitionsdk:alarm-notification-designer", version.ref = "ignition" }
    ignition-alarm-notification-gateway-api = { module = "com.inductiveautomation.ignitionsdk:alarm-notification-gateway-api", version.ref = "ignition" }
    ignition-client-api = { module = "com.inductiveautomation.ignitionsdk:client-api", version.ref = "ignition" }
    ignition-client-launcher = { module = "com.inductiveautomation.ignitionsdk:client-launcher", version.ref = "ignition" }
    ignition-common = { module = "com.inductiveautomation.ignitionsdk:ignition-common", version.ref = "ignition" }
    ignition-designer-api = { module = "com.inductiveautomation.ignitionsdk:designer-api", version.ref = "ignition" }
    ignition-designer-launcher = { module = "com.inductiveautomation.ignitionsdk:designer-launcher", version.ref = "ignition" }
    ignition-driver-api = { module = "com.inductiveautomation.ignitionsdk:driver-api", version.ref = "ignition" }
    ignition-gateway-api = { module = "com.inductiveautomation.ignitionsdk:gateway-api", version.ref = "ignition" }
    ignition-perspective-common = { module = "com.inductiveautomation.ignitionsdk:perspective-common", version.ref = "ignition" }
    ignition-perspective-designer = { module = "com.inductiveautomation.ignitionsdk:perspective-designer", version.ref = "ignition" }
    ignition-perspective-gateway = { module = "com.inductiveautomation.ignitionsdk:perspective-gateway", version.ref = "ignition" }
    ignition-reporting-common = { module = "com.inductiveautomation.ignitionsdk:reporting-common", version.ref = "ignition" }
    ignition-reporting-designer = { module = "com.inductiveautomation.ignitionsdk:reporting-designer", version.ref = "ignition" }
    ignition-reporting-gateway = { module = "com.inductiveautomation.ignitionsdk:reporting-gateway", version.ref = "ignition" }
    ignition-sfc-client = { module = "com.inductiveautomation.ignitionsdk:sfc-client", version.ref = "ignition" }
    ignition-sfc-common = { module = "com.inductiveautomation.ignitionsdk:sfc-common", version.ref = "ignition" }
    ignition-sfc-designer = { module = "com.inductiveautomation.ignitionsdk:sfc-designer", version.ref = "ignition" }
    ignition-sfc-gateway-api = { module = "com.inductiveautomation.ignitionsdk:sfc-gateway-api", version.ref = "ignition" }
    ignition-tag-historian = { module = "com.inductiveautomation.ignitionsdk:tag-historian", version.ref = "ignition" }
    ignition-vision-client-api = { module = "com.inductiveautomation.ignitionsdk:vision-client-api", version.ref = "ignition" }
    ignition-vision-common = { module = "com.inductiveautomation.ignitionsdk:vision-common", version.ref = "ignition" }
    ignition-vision-designer-api = { module = "com.inductiveautomation.ignitionsdk:vision-designer-api", version.ref = "ignition" }

# Dependencies for 3rd party libraries used in this module
    google-guava = { module = "com.google.guava:guava", version = "23.3-jre" }
    google-jsr305 = { module = "com.google.code.findbugs:jsr305", version = "3.0.1" }
    # ia modified version of gson from https://github.com/inductiveautomation/gson
    ia-gson = { module = "com.inductiveautomation.ignition:ia-gson", version = "2.8.5" }

```

### Common

#### build.gradle.kts

We starten met het subproject *common*. Voor elk subproject maak een nieuwe folder aan met de naam van het subproject. En maak een file aan met de naam `build.gradle.kts`.

In het geval van een Java subproject moet Java als plugin worden gedefinieerd. Ook de juiste Ignition dependencies moeten hier worden gedefinieerd.

```kotlin
plugins {
    `java-library`
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(11))
    }
}


dependencies {
    // compileOnly is the gradle equivalent to "provided" scope.  Here we resolve the dependencies via the
    // declarations in the gradle/libs.versions.toml file
    compileOnly(libs.ignition.common)
    compileOnly(libs.ignition.perspective.common)
    compileOnly(libs.google.guava)
    compileOnly(libs.ia.gson)
}
```

#### Algemene component settings

De folder structuur ziet er als volgt uit (rekening houden met wat er gedefinieerd staat in de algemene build file):

```
common
--src/main
----java/org/mustry/common
------component/display
--------EgComponent.java
------Componenten.java
----resources
------egcomponent.props.json
```

`Componenten.java` bevat de algemen configuratie voor all componenten in deze module.

`EgComponent.java` is een voorbeeld van 1 zo'n component deel van de module.

`egcomponent.props.json` hier worden de properties van een component gedefinieerd.

#### gradle settings

Laat weten aan gradle dat deze subproject ook moeten worden gebuild door in `settings.gradle.kts`  de volgende lijn toe te voegen: `include(":common")`.

Doe dit voor elk subproject e.g.: `include(":sub_project1", ":sub_project2")`.

### designer

Hier wordt het component geregistreerd voor de Ignition designer.

De designer build file is gelijkaardig aan die van common. Voeg enkel nog de dependecy op de common toe: `api(projects.common)`.

Behoud weer een gelijkaardige project structuur. Met de pad verandering van `/common` naar `designer`.

### gateway

### web application

Maak een folder aan en opnieuw een `build.gradle.kts` aan met de volgende inhoud:

```kotlin
import com.github.gradle.node.yarn.task.YarnTask
import com.github.gradle.node.npm.task.NpmTask

plugins {
    java
    id("com.github.node-gradle.node") version("3.2.1")
}
// define a variable that describes the path to the mounted gateway folder, where we want to put things eventually
val projectOutput: String by extra("$buildDir/generated-resources/")

// configurations on which versions of Node, Npm, and Yarn the gradle build should use.  Configuration provided by/to
// the gradle node plugin that"s applied above (com.moowork.node)
node {
    version.set("16.15.0")
    yarnVersion.set("1.22.18")
    npmVersion.set("8.5.5")
    download.set(true)
    nodeProjectDir.set(file(project.projectDir))

}

// define a gradle task that will install our npm dependencies, extends the YarnTask provided by the node gradle plugin
val yarnPackages by tasks.registering(YarnTask::class) {

    description = "Executes 'yarn' at the root of the web/ directory to install npm dependencies for the yarn workspace."
    // which yarn command to execute
    args.set(listOf("install", "--verbose"))

    // set this tasks "inputs" to be any package.json files or yarn.lock files that are found in or below our current
    // folder (project.projectDir).  This lets the build system avoid repeatedly trying to reinstall dependencies
    // which have already been installed.  If changes to package.json or yarn.lock are detected, then it will execute
    // the install task again.
    inputs.files(
        fileTree(project.projectDir).matching {
            include("**/package.json", "**/yarn.lock")
        }
    )

    // outputs of running 'yarn install'
    outputs.dirs(
        file("node_modules"),
        file("packages/client/node_modules"),
        file("packages/designer/node_modules")
    )

    dependsOn("${project.path}:yarn", ":web:npmSetup")
}

// define a gradle task that executes an npm script (defined in the package.json).
val webpack by tasks.registering(NpmTask::class) {
    group = "Ignition Module"
    description = "Runs 'npm run build', executing the build script of the web project's root package.json"

    // same as running "npm run build" in the ./web/ directory.
    args.set(listOf("run", "build"))

    // we require the installPackages to be done before the npm build (which calls webpack) can run, as we need our dependencies!
    dependsOn(yarnPackages)

    // we should re-run this task on consecutive builds if we detect changes to any non-generated files, so here we
    // define that we wish to have all files -- except those excluded -- as input dependencies for this task.
    inputs.files(project.fileTree("packages").matching {
        exclude("**/node_modules/**", "**/dist/**", "**/.awcache/**", "**/yarn-error.log")
    }.toList())

    // the outputs of this task include where we place the final files for use in the module, as well as the local
    // temporary "dist" folders.  Defining these outputs gives the build enough awareness to avoid running this
    // task if it"s already been executed, the outputs are where they are expected, and there have been no changes to
    // inputs.
    outputs.files(fileTree(projectOutput))
}

// task to delete the dist folders
val deleteDistFolders by tasks.registering(Delete::class) {
    delete(file("packages/designer/dist/"))
    delete(file("packages/client/dist/"))
}

tasks {
    processResources {
        dependsOn(webpack, yarnPackages)
    }

    clean {
        // makes the "built in" clean task execute the deletion tasks
        dependsOn(deleteDistFolders)
    }
}


val deepClean by tasks.registering {
    doLast {
        delete(file("packages/designer/node_modules"))
        delete(file("packages/designer/.gradle"))
        delete(file("packages/client/node_modules"))
        delete(file("packages/client/.gradle"))
        delete(file(".gradle"))
        delete(file("node_modules"))
    }

    dependsOn(project.tasks.named("clean"))
}

// make sure the gateway project doesn't process resources until the webpack task is done.
project(":gateway")?.tasks?.named("processResources")?.configure {
    dependsOn(webpack)
}


sourceSets {
    main {
        output.dir(projectOutput, "builtBy" to listOf(webpack))
    }
}

```



#### Dependencies

1. `cd web`

2. `npx lerna init`

3. Maak 2 verschillende packages: client en designer.

4. Navigeer naar de client package en installeer de juiste dependencies (package.json)

   ```json
   "scripts": {
       "build": "yarn run clean && webpack --mode development",
       "client": "yarn run build",
       "clean": "rimraf dist .awcache",
       "deepClean": "yarn run clean && rimraf node_modules __coverage__"
     },
   "dependencies": {
       "@inductiveautomation/perspective-client": "^2.1.16",
       "react": "^18.2.0"
     },
     "devDependencies": {
       "@fiverr/afterbuild-webpack-plugin": "^1.0.0",
       "@types/node": "^18.11.9",
       "@types/react": "^18.0.25",
       "mini-css-extract-plugin": "^2.7.1",
       "ts-loader": "^9.4.1",
       "typescript": "^4.9.3",
       "webpack": "^5.75.0",
       "webpack-cli": "^5.0.0",
       "yarn": "^1.22.19"
     }
   ```

5. Maak een file `.npmrc` met inhoud `@inductiveautomation:registry=https://nexus.inductiveautomation.com/repository/node-packages/` en een file `.yarnrc` met inhoud `"@inductiveautomation:registry" "https://nexus.inductiveautomation.com/repository/node-packages"`. Om yarn duidelijk te make de perspective-client dependecy kan worden gevonden.

6. Run `yarn` om de dependecies te installeren

#### webpack

Ik ben voorlopig nog niet zeker hoe deze code werkt maar het is nodig om je project op de juiste manier te builden zodat het herkend wordt door Ignition. Maak in de client een file `webpack.config.js` met de volgende inhoud (Pas aan zodat juiste namen gebruikt worden):

```js
/**
 * Webpack build configuration file.  Uses generic configuration that is appropriate for development.  Depending on
 * the needs of your module, you'll likely want to add appropriate 'production' configuration to this file in order
 * do do things such as minify, postcss, etc.
 *
 * To learn more about webpack, visit https://webpack.js.org/
 */

const webpack = require('webpack'),
    path = require('path'),
    fs = require('fs'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    AfterBuildPlugin = require('@fiverr/afterbuild-webpack-plugin');

const LibName = "TreeComponents";

// function that copies the result of the webpack from the dist/ folder into the  generated-resources folder which
// ultimately gets included in a 'web.jar'.  This jar is included in the module's gateway scope, and its contents are
// accessible as classpath resources just as if they were included in the gateway jar itself.
function copyToResources() {
    const generatedResourcesDir = path.resolve(__dirname, '../..', 'build/generated-resources/mounted/');
    const jsToCopy = path.resolve(__dirname, "dist/", `${LibName}.js`);
    const cssToCopy = path.resolve(__dirname, "dist/", `${LibName}.css`);
    const jSResourcePath = path.resolve(generatedResourcesDir, `${LibName}.js`);
    const cssResourcePath = path.resolve(generatedResourcesDir, `${LibName}.css`);


    const toCopy = [{from:jsToCopy, to: jSResourcePath}, {from: cssToCopy, to: cssResourcePath}];

    // if the desired folder doesn't exist, create it
    if (!fs.existsSync(generatedResourcesDir)){
        fs.mkdirSync(generatedResourcesDir, {recursive: true})
    }

    toCopy.forEach( file => {
        console.log(`copying ${file} into ${generatedResourcesDir}...`);

        try {
            fs.access(file.from, fs.constants.R_OK, (err) => {
                if (!err) {
                    fs.createReadStream(file.from)
                        .pipe(fs.createWriteStream(file.to));
                } else {
                    console.log(`Error when attempting to copy ${file.from} into ${file.to}`)
                }
            });
        } catch (err) {
            console.error(err);
            // rethrow to fail build
            throw err;
        }
    });
}


const config = {

    // define our entry point, from which we build our source tree for bundling
    entry: {
        TreeComponents:  path.join(__dirname, "./typescript/tree-client-components.ts")
    },

    output: {
        library: [LibName],  // name as it will be accessible by on the webpack when linked as a script
        path: path.join(__dirname, "dist"),
        filename: `${LibName}.js`,
        libraryTarget: "umd",
        umdNamedDefine: true
    },

    // Enable sourcemaps for debugging webpack's output.  Should be changed for production builds.
    devtool: "source-map",

    resolve: {
        extensions: [".jsx", ".js", ".ts", ".tsx", ".d.ts", ".css", ".scss"],
        modules: [
            path.resolve(__dirname, "../../node_modules")  // look at the local as well as shared node modules when resolving dependencies
        ]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: false
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$|.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            // tells css-loader not to treat `url('/some/path')` as things that need to resolve at build time
                            // in other words, the url value is simply passed-through as written in the css/sass
                            url: false
                        }
                    },
                    {
                        loader: "sass-loader",
                    }
                ]
            }
        ]
    },
    plugins: [
        new AfterBuildPlugin(function(stats) {
            copyToResources();
        }),
        // pulls CSS out into a single file instead of dynamically inlining it
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ],

    // IMPORTANT -- this tells the webpack build tooling "don't include these things as part of the webpack bundle".
    // They are 'provided' 'externally' via perspective/ignition at runtime, and we don't want multiple copies in the
    // browser.  Any libraries used that are also used in perspective should be excluded.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "mobx": "mobx",
        "mobx-react": "mobxReact",
        "@inductiveautomation/perspective-client": "PerspectiveClient"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
};


module.exports = () => config;

```

#### Components

Om components te maken navigeer naar de client maak een folder `typescript/modules`. Daarin kunnen de modules worden geschreven worden.

importeer de juiste libraries om:

```tsx
import * as React from 'react';
import {
    Component,
    ComponentMeta,
    ComponentProps,
    PComponent,
    PropertyTree,
    SizeObject
} from '@inductiveautomation/perspective-client';
```

Zoals (Merk op de extensie):

```tsx
export class HelloWorld extends Component<ComponentProps<{}>, any> {
    render() {
        return <h1>Hello world</h1>;
    }
}
```

Elk component heeft een Meta class nodig, deze Meta class is wat in Java wordt gebruikt:

```tsx
export class TreeMeta implements ComponentMeta {
    getComponentType(): string {
        // PAS OP: COMPONENT_TYPE moet het zelfde zijn als in Java is gedefinieerd
        return COMPONENT_TYPE;
    }

    getViewComponent(): PComponent {
        return HelloWorld;
    }

    getDefaultSize(): SizeObject {
        return ({
            width: 500,
            height: 500
        });
    }

    getPropsReducer(tree: PropertyTree): {} {
        return {};
    }
}
```

## Building gradle project

Run `./gradlew.bat clean`

en daarna `./gradlew.bat build`

Daarna kun je in de Ignition gateway de .modl file in de build folder importeren om je component in Ignition te testen.
