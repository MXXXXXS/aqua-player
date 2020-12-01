// exports = {
//   target: 'node',
//   node: {
//     __dirname: true, // 改变__dirname的默认行为, 基于context的配置
//     __filename: true
//   },
//   entry: { server: entryServer },
//   output: {
//     filename: '[name].js',
//     path: path.resolve(dist, 'server')
//   },
//   plugins: [
//     // new CleanWebpackPlugin(),
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: [{
//           loader: 'babel-loader'
//         }],
//         exclude: /node_modules/
//       }
//     ]
//   }
// }
