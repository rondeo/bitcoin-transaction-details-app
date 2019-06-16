/**
 * @format
 */
import './node_modules/rn-nodeify/shim.js';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
