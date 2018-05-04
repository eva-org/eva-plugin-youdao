import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
// import builtins from 'rollup-plugin-node-bui
import babel from 'rollup-plugin-babel';

export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [commonjs(), resolve(), json()]
};