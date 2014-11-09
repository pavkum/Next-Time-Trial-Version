#!/bin/bash

gulp clean
gulp move
gulp inject
cordova run android
