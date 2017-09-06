import cleanup from 'rollup-plugin-cleanup';

export default {
    name: 'THREE_HOLO',
    input: 'index.js',
    external: ['three'],
    globals: {
        three: 'THREE'
    },
    output: {
        file: 'dist/three-holographic.js',
        format: 'iife'
    },
    plugins: [
        cleanup()
    ]
}