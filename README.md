reactors-cli
===

[reactors](https://github.com/co2-git/reactors) command line interface

# Install

```bash
sudo npm install --global react-native-cli electron-prebuilt reactors-cli yarn
```

# Usage

```bash
# create a new reactors app
reactors init MyApp

# run app
reactors run android # run android
reactors run desktop # run desktop
reactors run ios # run ios
reactors run web # run web

# upgrade app
reactors upgrade

# build app
reactors build android # generate APK
reactors build osx # generate desktop app

# Android
reactors sign android # create signed keys
reactors install android # install on current device
```
