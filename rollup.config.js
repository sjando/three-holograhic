import cleanup from 'rollup-plugin-cleanup';

export default {
    input: 'index.js',
    external: ['three'],
    globals: {
        three: 'THREE'
    },
    output: {
        name: 'THREE_HOLO',
        file: 'dist/three-holographic.js',
        format: 'umd'
    },
    plugins: [
        cleanup()
    ]
}