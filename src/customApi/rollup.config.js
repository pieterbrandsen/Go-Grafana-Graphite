import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import clear from 'rollup-plugin-clear'
import json from '@rollup/plugin-json';

export default {
    input: 'src/api.ts',
    output: {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: false,
    },

    plugins: [
        clear({ targets: ["dist"] }),
        json(),
        resolve({ rootDir: 'src' }),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' }),
    ],
}
