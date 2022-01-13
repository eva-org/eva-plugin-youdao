import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

export default {
  input: 'dist/index.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins: [commonjs(), resolve(), json()]
}
