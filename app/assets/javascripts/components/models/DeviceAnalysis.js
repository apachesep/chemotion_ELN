import Element from './Element'
import AnalysesExperiment from './AnalysesExperiment'
import _ from 'lodash'

export default class DeviceAnalysis extends Element{
  constructor({
     id, sample_id, device_id, analysis_type, title, experiments
  }) {
    const device = {
      id: id,
      sampleId: sample_id,
      deviceId: device_id,
      experiments: experiments.map((e) => new AnalysesExperiment(e, sample_id)),
      type: 'deviceAnalysis',
      analysisType: analysis_type,
      title,
      activeAccordionExperiment: 0,
    }
    super(device)
  }
  
  checksum() {
    return super.checksum(['activeAccordionExperiment'])
  }

  static buildEmpty(sample, analysisType) {
    return new DeviceAnalysis({
      type: 'deviceAnalysis',
      sample_id: sample.id,
      analysis_type: analysisType,
      title: "",
      experiments: []
    })
  }
  
  serialize() {
    const serialized = super.serialize({
      sample_id: this.sampleId,
      experiments: this.experiments.map((e) => e.serialize()),
      analysis_type: this.analysisType,
      title: this.title,
    })
    return serialized 
  }

  buildConfig() {
    return {
      sample_id: this.sampleId,
      // FIXME multiple experiments
      data: this.buildExperimentsConfig()[0]
    }
  }

  buildExperimentsConfig() {
    return this.experiments.map((e) => ({
      'SOLVENT': e.solvent,
      'EXPERIMENT': e.experiment,
      'NAME': `Sample ${this.sampleId}`,
      'NUMERIC': e.numeric,
      'NUMBER_OF_SCANS': e.numberOfScans,
      // FIXME key of night-analysis?
      'DAY': e.onDay
    }))
  }
}
