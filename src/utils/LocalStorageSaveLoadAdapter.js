export class LocalStorageSaveLoadAdapter {
    constructor() {
      this._charts = this._getFromLocalStorage('charts') ?? [];
      this._studyTemplates = this._getFromLocalStorage('studyTemplates') ?? [];
      this._drawingTemplates = this._getFromLocalStorage('drawingTemplates') ?? [];
      this._chartTemplates = this._getFromLocalStorage('chartTemplates') ?? [];
      this._drawings = this._getFromLocalStorage('drawings') ?? {};
      this._isDirty = false;
  
      setInterval(() => {
        if (this._isDirty) {
          this._saveAll();
          this._isDirty = false;
        }
      }, 1000);
    }
  
    getAllCharts() {
      return Promise.resolve(this._charts);
    }
  
    removeChart(id) {
      const index = this._charts.findIndex((c) => c.id === id);
      if (index >= 0) {
        this._charts.splice(index, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
      return Promise.reject(new Error('Chart not found'));
    }
  
    saveChart(chartData) {
      if (!chartData.id) {
        chartData.id = this._generateId();
      } else {
        this.removeChart(chartData.id);
      }
  
      const savedChart = {
        ...chartData,
        timestamp: Date.now(),
        id: chartData.id,
      };
  
      this._charts.push(savedChart);
      this._isDirty = true;
      return Promise.resolve(savedChart.id);
    }
  
    getChartContent(id) {
      const chart = this._charts.find((c) => c.id === id);
      return chart ? Promise.resolve(chart.content) : Promise.reject(new Error('Chart not found'));
    }
  
    removeStudyTemplate({ name }) {
      const index = this._studyTemplates.findIndex((s) => s.name === name);
      if (index >= 0) {
        this._studyTemplates.splice(index, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
      return Promise.reject(new Error('Study template not found'));
    }
  
    getStudyTemplateContent({ name }) {
      const template = this._studyTemplates.find((t) => t.name === name);
      return template ? Promise.resolve(template.content) : Promise.reject(new Error('Study template not found'));
    }
  
    saveStudyTemplate(template) {
      this._studyTemplates = this._studyTemplates.filter((t) => t.name !== template.name);
      this._studyTemplates.push(template);
      this._isDirty = true;
      return Promise.resolve();
    }
  
    getAllStudyTemplates() {
      return Promise.resolve(this._studyTemplates);
    }
  
    removeDrawingTemplate(toolName, name) {
      const index = this._drawingTemplates.findIndex((t) => t.toolName === toolName && t.name === name);
      if (index >= 0) {
        this._drawingTemplates.splice(index, 1);
        this._isDirty = true;
        return Promise.resolve();
      }
      return Promise.reject(new Error('Drawing template not found'));
    }
  
    loadDrawingTemplate(toolName, name) {
      const template = this._drawingTemplates.find((t) => t.toolName === toolName && t.name === name);
      return template ? Promise.resolve(template.content) : Promise.reject(new Error('Drawing template not found'));
    }
  
    saveDrawingTemplate(toolName, name, content) {
      this._drawingTemplates = this._drawingTemplates.filter((t) => t.toolName !== toolName || t.name !== name);
      this._drawingTemplates.push({ toolName, name, content });
      this._isDirty = true;
      return Promise.resolve();
    }
  
    getDrawingTemplates() {
      return Promise.resolve(this._drawingTemplates.map((t) => t.name));
    }
  
    getAllChartTemplates() {
      return Promise.resolve(this._chartTemplates.map((t) => t.name));
    }
  
    saveChartTemplate(name, content) {
      const index = this._chartTemplates.findIndex((t) => t.name === name);
      if (index >= 0) {
        this._chartTemplates[index].content = content;
      } else {
        this._chartTemplates.push({ name, content });
      }
      this._isDirty = true;
      return Promise.resolve();
    }
  
    removeChartTemplate(name) {
      this._chartTemplates = this._chartTemplates.filter((t) => t.name !== name);
      this._isDirty = true;
      return Promise.resolve();
    }
  
    getChartTemplateContent(name) {
      const template = this._chartTemplates.find((t) => t.name === name);
      return Promise.resolve({ content: structuredClone(template?.content) });
    }
  
    saveLineToolsAndGroups(layoutId, chartId, state) {
      const key = this._drawingKey(layoutId, chartId);
      if (!this._drawings[key]) this._drawings[key] = {};
  
      for (const [k, v] of state.sources) {
        if (v === null) delete this._drawings[key][k];
        else this._drawings[key][k] = v;
      }
      this._isDirty = true;
      return Promise.resolve();
    }
  
    loadLineToolsAndGroups(layoutId, chartId) {
      if (!layoutId) return Promise.resolve(null);
      const key = this._drawingKey(layoutId, chartId);
      const raw = this._drawings[key];
      if (!raw) return Promise.resolve(null);
  
      const sources = new Map(Object.entries(raw));
      return Promise.resolve({ sources });
    }
  
    _generateId() {
      return Math.random().toString(36).substr(2, 9);
    }
  
    _getFromLocalStorage(key) {
      return JSON.parse(window.localStorage.getItem(key) || 'null');
    }
  
    _saveToLocalStorage(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  
    _saveAll() {
      this._saveToLocalStorage('charts', this._charts);
      this._saveToLocalStorage('studyTemplates', this._studyTemplates);
      this._saveToLocalStorage('drawingTemplates', this._drawingTemplates);
      this._saveToLocalStorage('chartTemplates', this._chartTemplates);
      this._saveToLocalStorage('drawings', this._drawings);
    }
  
    _drawingKey(layoutId, chartId) {
      return `${layoutId}/${chartId}`;
    }
  }
  