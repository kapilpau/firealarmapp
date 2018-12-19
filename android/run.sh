#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.kapilpau.iotfirealarm/host.exp.exponent.MainActivity
