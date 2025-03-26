# Signing Module

1. Create gradle.properties in root folder of the project and copy there the credentails. It should look like this:

```
ignition.signing.keystoreFile=certificates/keystore.jks
ignition.signing.keystorePassword=<password>

ignition.signing.certAlias=<alias>
ignition.signing.certFile=<certificate>
ignition.signing.certPassword=<certificate password>
```

2. Create certificates folder and copy there the certificate files

Verify the keystore password

  ```
  keytool -list -keystore certificates/keystore.jks
  ```

3. Run the build
```
./gradlew clean build
```


> Module signing can be skipped by setting `skipModlSigning.set(True)` in build.gradle.kts