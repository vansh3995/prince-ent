import * as tf from '@tensorflow/tfjs-node'

export class RouteOptimizer {
  private model: tf.LayersModel | null = null
  
  async loadModel() {
    this.model = await tf.loadLayersModel('/models/route-optimizer.json')
  }
  
  async predictBestRoute(waypoints: number[][]) {
    if (!this.model) await this.loadModel()
    
    const input = tf.tensor2d(waypoints)
    const prediction = this.model!.predict(input) as tf.Tensor
    
    return prediction.dataSync()
  }
}