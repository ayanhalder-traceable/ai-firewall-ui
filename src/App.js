import React, { useState, useCallback, useEffect } from 'react';
import { Shield, AlertTriangle, Bell, ChevronDown, X, Plus, Trash2, Settings, FileText, Tag, Server, Link2, Percent, Download, List, PieChart as PieChartIcon, BarChart2, Calendar, HelpCircle, Clock, Key } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




// --- Helper Components ---


const Card = ({ children, className = '' }) => (
 <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden ${className}`}>
   {children}
 </div>
);


const CardHeader = ({ title, subtitle, icon, children }) => (
 <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-start gap-4">
   <div className="flex items-center">
     {icon && <div className="mr-4 text-gray-500 dark:text-gray-400">{icon}</div>}
     <div>
       <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
       {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
     </div>
   </div>
   <div className="flex items-center space-x-2 flex-shrink-0">
     {children}
   </div>
 </div>
);


const ToggleSwitch = ({ enabled, onChange }) => (
 <button
   onClick={() => onChange(!enabled)}
   className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 ${
     enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
   }`}
 >
   <span
     className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
       enabled ? 'translate-x-6' : 'translate-x-1'
     }`}
   />
 </button>
);


const Select = ({ value, onChange, options, disabled = false, className='' }) => (
 <div className={`relative ${className}`}>
   <select
     value={value}
     onChange={(e) => { if (onChange) onChange(e.target.value); }}
     disabled={disabled}
     className={`appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-8 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
   >
     {options.map(option => (
       <option key={option.value} value={option.value}>{option.label}</option>
     ))}
   </select>
   <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
 </div>
);


const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
 const baseClasses = 'px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 flex items-center justify-center space-x-2';
 const variants = {
   primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
   secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400',
   danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
   ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
 };
 const disabledClasses = 'opacity-50 cursor-not-allowed';
 return (
   <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${disabled ? disabledClasses : ''} ${className}`}>
     {children}
   </button>
 );
};


const Modal = ({ isOpen, onClose, title, children }) => {
 if (!isOpen) return null;


 return (
   <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all" onClick={e => e.stopPropagation()}>
       <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
         <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
         <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
           <X size={24} />
         </button>
       </div>
       <div className="p-6 max-h-[70vh] overflow-y-auto">
         {children}
       </div>
     </div>
   </div>
 );
};


const Input = ({ value, onChange, placeholder, type = 'text', disabled = false, className = '' }) => (
   <input
       type={type}
       value={value}
       onChange={e => { if (onChange) onChange(e.target.value); }}
       placeholder={placeholder}
       disabled={disabled}
       className={`w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
   />
);


const TagInput = ({ tags, setTags }) => {
   const [inputValue, setInputValue] = useState('');


   const handleKeyDown = (e) => {
       if (e.key === 'Enter' || e.key === ',') {
           e.preventDefault();
           const newTag = inputValue.trim();
           if (newTag && !tags.includes(newTag)) {
               setTags([...tags, newTag]);
           }
           setInputValue('');
       }
   };


   const removeTag = (tagToRemove) => {
       setTags(tags.filter(tag => tag !== tagToRemove));
   };


   return (
       <div>
           <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
               {tags.map(tag => (
                   <div key={tag} className="flex items-center bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-2.5 py-1 rounded-full">
                       {tag}
                       <button onClick={() => removeTag(tag)} className="ml-2 text-indigo-500 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-100">
                           <X size={14} />
                       </button>
                   </div>
               ))}
               <input
                   type="text"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={handleKeyDown}
                   placeholder="Add a tag..."
                   className="flex-grow bg-transparent outline-none text-sm p-1"
               />
           </div>
       </div>
   );
};


const TooltipIcon = ({ text }) => {
   return (
       <div className="relative flex items-center group">
           <HelpCircle size={16} className="text-gray-400 dark:text-gray-500 ml-2 cursor-help" />
           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
               {text}
           </div>
       </div>
   );
};




// --- Firewall Rules View Components ---


const initialRulesData = [
   { id: 'prompt_injection', name: 'LLM Prompt Injection', description: 'Detects input attempts to influence app behavior with commands.', enabled: true, action: 'Deny', sensitivity: 'High', hasSensitivity: true },
   { id: 'pii_input', name: 'PII Detected on LLM Input', description: "Flags inputs that contain personally identifiable information.", enabled: true, action: 'Alert', hasSensitivity: false, isPiiRule: true, piiTypes: { 'Credit Card Number': true, 'Social Security Number': true, 'Phone Number': false, 'Email Address': true }, customPii: [{ id: 1, name: 'Internal Project ID', pattern: 'PROJ-[A-Z0-9]{8}' }] },
   { id: 'pii_output', name: 'PII Detected on LLM Output', description: "Flags outputs that contain personally identifiable information.", enabled: true, action: 'Deny', hasSensitivity: false, isPiiRule: true, piiTypes: { 'Credit Card Number': true, 'Social Security Number': true, 'Phone Number': true, 'Email Address': true }, customPii: [] },
   { id: 'toxic_content', name: 'Toxic Content', description: 'Detects harmful, abusive, or offensive language.', enabled: true, action: 'Deny', sensitivity: 'Medium', hasSensitivity: true },
   { id: 'rate_limiting', name: 'Advanced Rate Limiting', description: 'Manage request rates by IP address or API key for specific models.', enabled: false, action: 'Deny', hasSensitivity: false, isRateLimitRule: true, rateLimitConfig: { 'gpt-4-turbo': [{ id: 1, requests: 10, period: 60, keyBy: 'IP Address' }] } },
   { id: 'long_message', name: 'LLM Input/Output Too Long', description: 'Lets you set a character limit for messages.', enabled: false, action: 'Deny', hasSensitivity: false },
   { id: 'non_allowed_lang', name: 'Non-allowed Language', description: "Detects the use of a language that your LLM doesn't support.", enabled: false, action: 'Alert', sensitivity: 'High', hasSensitivity: true },
   { id: 'code_detected', name: 'Code Detected in Input/Output', description: 'Detects code injection attacks like XSS or SQL Injection.', enabled: true, action: 'Deny', sensitivity: 'High', hasSensitivity: true },
];


const PiiConfigModal = ({ rule, onClose, onSave }) => {
   const [piiTypes, setPiiTypes] = useState(rule.piiTypes || {});
   const [customPii, setCustomPii] = useState(rule.customPii || []);
   const [newPiiName, setNewPiiName] = useState('');
   const [newPiiPattern, setNewPiiPattern] = useState('');


   const handleTogglePiiType = (type) => setPiiTypes(prev => ({ ...prev, [type]: !prev[type] }));
   const handleAddCustomPii = () => {
       if (newPiiName.trim() && newPiiPattern.trim()) {
           setCustomPii(prev => [...prev, { id: Date.now(), name: newPiiName, pattern: newPiiPattern }]);
           setNewPiiName('');
           setNewPiiPattern('');
       }
   };
   const handleRemoveCustomPii = (id) => setCustomPii(prev => prev.filter(p => p.id !== id));
   const handleSave = () => {
       onSave(rule.id, { piiTypes, customPii });
       onClose();
   };


   return (
       <Modal isOpen={true} onClose={onClose} title={`Configure: ${rule.name}`}>
           <div className="space-y-6">
               <div>
                   <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Standard PII Fields</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {Object.entries(piiTypes).map(([type, enabled]) => (
                           <label key={type} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                               <input type="checkbox" checked={enabled} onChange={() => handleTogglePiiType(type)} className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                               <span className="text-gray-700 dark:text-gray-300">{type}</span>
                           </label>
                       ))}
                   </div>
               </div>
               <div>
                   <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">Custom PII Fields</h4>
                   <div className="space-y-3 mb-4">
                       {customPii.map(p => (
                           <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                               <div>
                                   <p className="font-medium text-gray-800 dark:text-gray-200">{p.name}</p>
                                   <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">{p.pattern}</p>
                               </div>
                               <Button onClick={() => handleRemoveCustomPii(p.id)} variant="danger" className="!p-2"><Trash2 size={16} /></Button>
                           </div>
                       ))}
                        {customPii.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No custom fields defined.</p>}
                   </div>
                   <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-4">
                       <h5 className="font-semibold text-gray-800 dark:text-gray-200">Add Custom PII Field</h5>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Input value={newPiiName} onChange={setNewPiiName} placeholder="Field Name (e.g., Auth Token)" />
                           <Input value={newPiiPattern} onChange={setNewPiiPattern} placeholder="RegEx Pattern" className="font-mono" />
                       </div>
                       <Button onClick={handleAddCustomPii}><Plus size={16} /><span>Add Field</span></Button>
                   </div>
               </div>
           </div>
           <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
               <Button onClick={onClose} variant="secondary">Cancel</Button>
               <Button onClick={handleSave} variant="primary">Save Changes</Button>
           </div>
       </Modal>
   );
};


const RateLimitConfigModal = ({ rule, onClose, onSave, models }) => {
   const [config, setConfig] = useState(rule.rateLimitConfig || {});
   const [selectedModel, setSelectedModel] = useState(models[0]);


   const handleModelChange = (model) => {
       setSelectedModel(model);
       if (!config[model]) {
           setConfig(prev => ({ ...prev, [model]: [] }));
       }
   };


   const handleRuleChange = (model, index, field, value) => {
       const newConfig = { ...config };
       const newRules = [...newConfig[model]];
       newRules[index] = { ...newRules[index], [field]: value };


       if (field === 'keyBy' && value === 'API Key' && !newRules[index].apiKeyReferences) {
           newRules[index].apiKeyReferences = [{ id: Date.now(), source: 'Header', keyName: '' }];
       }


       newConfig[model] = newRules;
       setConfig(newConfig);
   };
  
   const handleApiRefChange = (model, ruleIndex, refIndex, field, value) => {
       const newConfig = { ...config };
       const newRules = [...newConfig[model]];
       const newRefs = [...newRules[ruleIndex].apiKeyReferences];
       newRefs[refIndex] = { ...newRefs[refIndex], [field]: value };
       newRules[ruleIndex].apiKeyReferences = newRefs;
       newConfig[model] = newRules;
       setConfig(newConfig);
   };
  
   const addApiRef = (model, ruleIndex) => {
       const newConfig = { ...config };
       const newRules = [...newConfig[model]];
       if (!newRules[ruleIndex].apiKeyReferences) {
           newRules[ruleIndex].apiKeyReferences = [];
       }
       newRules[ruleIndex].apiKeyReferences.push({ id: Date.now(), source: 'Header', keyName: '' });
       newConfig[model] = newRules;
       setConfig(newConfig);
   };


   const removeApiRef = (model, ruleIndex, refId) => {
       const newConfig = { ...config };
       const newRules = [...newConfig[model]];
       newRules[ruleIndex].apiKeyReferences = newRules[ruleIndex].apiKeyReferences.filter(ref => ref.id !== refId);
       newConfig[model] = newRules;
       setConfig(newConfig);
   };


   const addRateRule = (model) => {
       const newRule = { id: Date.now(), requests: 10, period: 60, keyBy: 'IP Address' };
       const newConfig = { ...config };
       if (!newConfig[model]) {
           newConfig[model] = [];
       }
       newConfig[model].push(newRule);
       setConfig(newConfig);
   };


   const removeRateRule = (model, id) => {
       const newConfig = { ...config };
       newConfig[model] = newConfig[model].filter(r => r.id !== id);
       setConfig(newConfig);
   };


   const handleSave = () => {
       onSave(rule.id, { rateLimitConfig: config });
       onClose();
   };


   return (
       <Modal isOpen={true} onClose={onClose} title={`Configure: ${rule.name}`}>
           <div className="space-y-6">
               <div>
                   <label className="font-semibold text-gray-800 dark:text-gray-200 mb-2 block">Select Model</label>
                   <Select options={models.map(m => ({ value: m, label: m }))} value={selectedModel} onChange={handleModelChange} />
               </div>


               <div className="space-y-4">
                   <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Rate Limit Rules for <span className="text-indigo-500">{selectedModel}</span></h4>
                   {(config[selectedModel] || []).map((rateRule, index) => (
                       <div key={rateRule.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                               <Input type="number" value={rateRule.requests} onChange={v => handleRuleChange(selectedModel, index, 'requests', v)} placeholder="Requests" />
                               <div className="flex items-center">
                                   <span className="mr-2 text-gray-500">/</span>
                                   <Input type="number" value={rateRule.period} onChange={v => handleRuleChange(selectedModel, index, 'period', v)} placeholder="Period (s)" />
                                   <span className="ml-2 text-gray-500">s</span>
                               </div>
                               <Select options={[{ value: 'IP Address', label: 'by IP Address' }, { value: 'API Key', label: 'by API Key' }]} value={rateRule.keyBy} onChange={v => handleRuleChange(selectedModel, index, 'keyBy', v)} />
                               <Button variant="danger" onClick={() => removeRateRule(selectedModel, rateRule.id)} className="!p-2">
                                   <Trash2 size={16} />
                               </Button>
                           </div>
                           {rateRule.keyBy === 'API Key' && (
                               <div className="pl-4 mt-4 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-3">
                                   <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center"><Key size={14} className="mr-2"/>API Key Locations</h5>
                                   {(rateRule.apiKeyReferences || []).map((ref, refIndex) => (
                                       <div key={ref.id} className="flex items-center space-x-2">
                                           <Select
                                               className="flex-1"
                                               options={[{value: 'Header', label: 'Header'}, {value: 'Cookie', label: 'Cookie'}, {value: 'Query', label: 'Query Param'}]}
                                               value={ref.source}
                                               onChange={v => handleApiRefChange(selectedModel, index, refIndex, 'source', v)}
                                           />
                                           <Input
                                               className="flex-2"
                                               value={ref.keyName}
                                               onChange={v => handleApiRefChange(selectedModel, index, refIndex, 'keyName', v)}
                                               placeholder="Header/Cookie/Param Name"
                                           />
                                           <Button variant="danger" onClick={() => removeApiRef(selectedModel, index, ref.id)} className="!p-2">
                                               <X size={14} />
                                           </Button>
                                       </div>
                                   ))}
                                   <Button variant="secondary" onClick={() => addApiRef(selectedModel, index)} className="!py-1 !px-2 !text-xs">
                                       <Plus size={14} />
                                       <span>Add Key Location</span>
                                   </Button>
                               </div>
                           )}
                       </div>
                   ))}
                    {(config[selectedModel] || []).length === 0 && (
                       <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No rate limit rules defined for this model.</p>
                   )}
                   <Button variant="secondary" onClick={() => addRateRule(selectedModel)}>
                       <Plus size={16} />
                       <span>Add Rate Limit Rule</span>
                   </Button>
               </div>
           </div>
           <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
               <Button onClick={onClose} variant="secondary">Cancel</Button>
               <Button onClick={handleSave} variant="primary">Save Changes</Button>
           </div>
       </Modal>
   );
};


const RuleRow = ({ rule, onUpdate, onConfigurePii, onConfigureRateLimit }) => {
   const handleUpdate = (key, value) => onUpdate(rule.id, { ...rule, [key]: value });


   const renderConfigureButton = () => {
       if (rule.isPiiRule) {
           return <Button onClick={() => onConfigurePii(rule)} variant="secondary" disabled={!rule.enabled}>Configure</Button>;
       }
       if (rule.isRateLimitRule) {
           return <Button onClick={() => onConfigureRateLimit(rule)} variant="secondary" disabled={!rule.enabled}>Configure</Button>;
       }
       return <div className="w-full h-10"></div>;
   };


   return (
       <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
           <div className="md:col-span-4">
               <p className="font-bold text-gray-900 dark:text-white">{rule.name}</p>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rule.description}</p>
           </div>
           <div className="md:col-span-2 flex items-center justify-start md:justify-center"><ToggleSwitch enabled={rule.enabled} onChange={(val) => handleUpdate('enabled', val)} /></div>
           <div className="md:col-span-2"><Select value={rule.action} onChange={(val) => handleUpdate('action', val)} options={[{ value: 'Alert', label: 'Alert' }, { value: 'Deny', label: 'Deny' }]} disabled={!rule.enabled} /></div>
           <div className="md:col-span-2">{rule.hasSensitivity ? <Select value={rule.sensitivity} onChange={(val) => handleUpdate('sensitivity', val)} options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }]} disabled={!rule.enabled} /> : <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center justify-start md:justify-center h-full">—</span>}</div>
           <div className="md:col-span-2 flex justify-start md:justify-end">{renderConfigureButton()}</div>
       </div>
   );
};


const FirewallRulesView = ({ showSavedMessage, handleSaveChanges }) => {
   const [rules, setRules] = useState(initialRulesData);
   const [configuringPiiRule, setConfiguringPiiRule] = useState(null);
   const [configuringRateLimitRule, setConfiguringRateLimitRule] = useState(null);


   const availableModels = ['gpt-4-turbo', 'claude-3-opus', 'gemini-1.5-pro', 'llama-3-70b'];


   const handleUpdateRule = useCallback((ruleId, updatedData) => setRules(p => p.map(r => (r.id === ruleId ? { ...r, ...updatedData } : r))), []);
   const handleSavePiiConfig = useCallback((ruleId, piiConfig) => setRules(p => p.map(r => r.id === ruleId ? { ...r, ...piiConfig } : r)), []);
   const handleSaveRateLimitConfig = useCallback((ruleId, rateLimitConfig) => setRules(p => p.map(r => r.id === ruleId ? { ...r, ...rateLimitConfig } : r)), []);
  
   return (
       <Card>
           <CardHeader title="Firewall Rules" subtitle="Select rules to enforce and the action to take when a rule is triggered." icon={<Shield size={28} className="text-indigo-500" />}>
                <Button onClick={() => handleSaveChanges(rules)}>Save Changes</Button>
           </CardHeader>
           {showSavedMessage && <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 mx-6 mt-4 rounded-r-lg" role="alert"><p className="font-bold">Success!</p><p>Your firewall rules have been saved.</p></div>}
           <div>
               <div className="hidden md:grid md:grid-cols-12 gap-4 items-center py-3 px-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                   <div className="md:col-span-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Rule</div>
                   <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">Status</div>
                   <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Action</div>
                   <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Sensitivity</div>
                   <div className="md:col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">Configuration</div>
               </div>
               <div>{rules.map(rule => <RuleRow key={rule.id} rule={rule} onUpdate={handleUpdateRule} onConfigurePii={setConfiguringPiiRule} onConfigureRateLimit={setConfiguringRateLimitRule} />)}</div>
           </div>
           {configuringPiiRule && <PiiConfigModal rule={configuringPiiRule} onClose={() => setConfiguringPiiRule(null)} onSave={handleSavePiiConfig} />}
           {configuringRateLimitRule && <RateLimitConfigModal rule={configuringRateLimitRule} onClose={() => setConfiguringRateLimitRule(null)} onSave={handleSaveRateLimitConfig} models={availableModels} />}
       </Card>
   );
}


// --- Applied Applications View Components ---
const AppConfigModal = ({ isOpen, onClose, onSave, app, firewallConfigs }) => {
   const [config, setConfig] = useState({
       appName: '', description: '', tags: [], firewallConfigId: '', sampleRate: 100,
       endpoints: [{ hostnames: '', path: '' }],
       checkInput: false, checkOutput: false,
       inputJsonPath: '', inputMaxLength: '', inputEncoding: 'None',
       outputJsonPath: '', outputMaxLength: '', outputEncoding: 'None',
   });


   useEffect(() => {
       if (app) {
           const appEndpoints = app.endpoints && Array.isArray(app.endpoints) && app.endpoints.length > 0
               ? app.endpoints
               : [{ hostnames: app.hostnames || '', path: app.path || '' }];
           setConfig({ ...app, endpoints: appEndpoints });
       } else {
           const initialConfig = {
               appName: '', description: '', tags: [],
               firewallConfigId: firewallConfigs.length > 0 ? firewallConfigs[0].id : '',
               sampleRate: 100,
               endpoints: [{ hostnames: '', path: '' }],
               checkInput: false, checkOutput: false,
               inputJsonPath: '$.chatprompt', inputMaxLength: '10000', inputEncoding: 'None',
               outputJsonPath: '$.response', outputMaxLength: '10000', outputEncoding: 'None',
           };
           setConfig(initialConfig);
       }
   }, [app, firewallConfigs]);


   const handleChange = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));
  
   const handleEndpointChange = (index, field, value) => {
       const newEndpoints = [...config.endpoints];
       newEndpoints[index][field] = value;
       handleChange('endpoints', newEndpoints);
   };


   const addEndpoint = () => {
       handleChange('endpoints', [...config.endpoints, { hostnames: '', path: '' }]);
   };


   const removeEndpoint = (index) => {
       const newEndpoints = config.endpoints.filter((_, i) => i !== index);
       handleChange('endpoints', newEndpoints);
   };


   const handleSave = () => {
       onSave({ ...config, id: app?.id || Date.now() });
       onClose();
   };


   const Section = ({ title, icon, children }) => (
       <div className="space-y-4 py-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
           <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center"><span className="mr-3 text-indigo-500">{icon}</span>{title}</h4>
           <div className="pl-8 space-y-4">{children}</div>
       </div>
   );


   return (
       <Modal isOpen={isOpen} onClose={onClose} title={app ? 'Edit AI Application' : 'Add New AI Application'}>
           <div className="space-y-2">
               <Section title="Application Details" icon={<FileText size={20}/>}>
                   <Input value={config.appName} onChange={v => handleChange('appName', v)} placeholder="Application Name"/>
                   <Input value={config.description} onChange={v => handleChange('description', v)} placeholder="Description (optional)"/>
                   <TagInput tags={config.tags} setTags={v => handleChange('tags', v)} />
               </Section>
              
               <Section title="Firewall & Sampling" icon={<Settings size={20}/>}>
                   <Select label="Firewall Configuration" options={firewallConfigs.map(c => ({ value: c.id, label: c.name }))} value={config.firewallConfigId} onChange={v => handleChange('firewallConfigId', v)} />
                   <div className="flex items-center space-x-3">
                       <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sample Rate:</label>
                       <Input type="number" value={config.sampleRate} onChange={v => handleChange('sampleRate', v)} className="w-24" />
                       <Percent size={16} className="text-gray-500" />
                   </div>
               </Section>


               <Section title="Endpoint Targeting" icon={<Link2 size={20}/>}>
                   <div className="space-y-3">
                       {config.endpoints.map((endpoint, index) => (
                           <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                               <Input
                                   value={endpoint.hostnames}
                                   onChange={v => handleEndpointChange(index, 'hostnames', v)}
                                   placeholder="Endpoint Hostnames (e.g., api.example.com)"
                                   className="flex-grow"
                               />
                               <Input
                                   value={endpoint.path}
                                   onChange={v => handleEndpointChange(index, 'path', v)}
                                   placeholder="Endpoint Path (must start with /)"
                                   className="flex-grow"
                               />
                               {config.endpoints.length > 1 && (
                                   <Button variant="danger" onClick={() => removeEndpoint(index)} className="!p-2">
                                       <Trash2 size={16} />
                                   </Button>
                               )}
                           </div>
                       ))}
                   </div>
                   <Button variant="secondary" onClick={addEndpoint} className="mt-3">
                       <Plus size={16} />
                       <span>Add API Endpoint</span>
                   </Button>
               </Section>


               <Section title="Message Evaluation" icon={<Shield size={20}/>}>
                   <div className="space-y-4">
                       <label className="flex items-center space-x-3 cursor-pointer"><ToggleSwitch enabled={config.checkInput} onChange={v => handleChange('checkInput', v)} /><span>Check Input</span></label>
                       {config.checkInput && (
                           <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3 ml-8">
                               <Input value={config.inputJsonPath} onChange={v => handleChange('inputJsonPath', v)} placeholder="Input JSON Path (e.g., $.chatprompt)"/>
                               <Input type="number" value={config.inputMaxLength} onChange={v => handleChange('inputMaxLength', v)} placeholder="Max Input Length (characters)"/>
                               <Select options={[{value: 'None', label: 'Encoding: None'}, {value: 'URL', label: 'Encoding: URL'}]} value={config.inputEncoding} onChange={v => handleChange('inputEncoding', v)} />
                           </div>
                       )}
                       <label className="flex items-center space-x-3 cursor-pointer"><ToggleSwitch enabled={config.checkOutput} onChange={v => handleChange('checkOutput', v)} /><span>Check Output</span></label>
                       {config.checkOutput && (
                           <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3 ml-8">
                               <Input value={config.outputJsonPath} onChange={v => handleChange('outputJsonPath', v)} placeholder="Output JSON Path (e.g., $.response)"/>
                               <Input type="number" value={config.outputMaxLength} onChange={v => handleChange('outputMaxLength', v)} placeholder="Max Output Length (characters)"/>
                               <Select options={[{value: 'None', label: 'Encoding: None'}, {value: 'URL', label: 'Encoding: URL'}]} value={config.outputEncoding} onChange={v => handleChange('outputEncoding', v)} />
                           </div>
                       )}
                   </div>
               </Section>
           </div>
           <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
               <Button onClick={onClose} variant="secondary">Cancel</Button>
               <Button onClick={handleSave} variant="primary">Save Application</Button>
           </div>
       </Modal>
   );
};


const AppliedAppsView = ({ showSavedMessage, handleSaveChanges, firewallConfigs, apps, setApps }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingApp, setEditingApp] = useState(null);
   const [isFirewallOn, setIsFirewallOn] = useState(true);


   const handleOpenModal = (app = null) => {
       setEditingApp(app);
       setIsModalOpen(true);
   };


   const handleCloseModal = () => {
       setEditingApp(null);
       setIsModalOpen(false);
   };


   const handleSaveApp = (appData) => {
       const newApps = [...apps];
       const index = newApps.findIndex(a => a.id === appData.id);
       if (index > -1) {
           newApps[index] = appData;
       } else {
           newApps.push(appData);
       }
       setApps(newApps);
       handleSaveChanges(newApps);
   };


   const handleDeleteApp = (appId) => {
       const newApps = apps.filter(a => a.id !== appId);
       setApps(newApps);
       handleSaveChanges(newApps);
   };


   return (
       <Card>
           <CardHeader title="Applied Applications" subtitle="Apply firewall configurations to your AI applications." icon={<Server size={28} className="text-indigo-500" />}>
               <Button onClick={() => handleOpenModal()} disabled={!isFirewallOn}><Plus size={16}/><span>Add AI Application</span></Button>
           </CardHeader>
           <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                   <div className="font-semibold text-gray-800 dark:text-gray-200">Firewall for AI</div>
                   <ToggleSwitch enabled={isFirewallOn} onChange={setIsFirewallOn} />
               </div>
               {showSavedMessage && <div className="bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-r-lg" role="alert"><p className="font-bold">Success!</p><p>Your application settings have been saved.</p></div>}
               <div className="space-y-4">
                   {apps.map(app => (
                       <div key={app.id} className={`p-4 border dark:border-gray-700 rounded-lg transition-opacity ${isFirewallOn ? 'opacity-100' : 'opacity-50 bg-gray-50 dark:bg-gray-800/50'}`}>
                           <div className="flex justify-between items-start">
                               <div>
                                   <h3 className="font-bold text-lg text-gray-900 dark:text-white">{app.appName}</h3>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">{app.description}</p>
                                   <div className="mt-3 space-y-2">
                                       {(app.endpoints || []).map((ep, idx) => (
                                           <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                               <Link2 size={14} className="mr-2 flex-shrink-0" />
                                               <span className="font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                                                   {ep.hostnames}{ep.path}
                                               </span>
                                           </div>
                                       ))}
                                   </div>
                                   <div className="mt-3 flex flex-wrap gap-2">
                                       {app.tags.map(tag => <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">{tag}</span>)}
                                   </div>
                               </div>
                               <div className="flex space-x-2">
                                   <Button variant="secondary" onClick={() => handleOpenModal(app)} disabled={!isFirewallOn}>Edit</Button>
                                   <Button variant="danger" onClick={() => handleDeleteApp(app.id)} disabled={!isFirewallOn}><Trash2 size={16}/></Button>
                               </div>
                           </div>
                       </div>
                   ))}
                   {apps.length === 0 && (
                       <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                           <p className="text-gray-500 dark:text-gray-400">No AI applications have been added.</p>
                           <Button onClick={() => handleOpenModal()} disabled={!isFirewallOn} className="mt-4"><Plus size={16}/><span>Add your first application</span></Button>
                       </div>
                   )}
               </div>
           </div>
           {isModalOpen && <AppConfigModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveApp} app={editingApp} firewallConfigs={firewallConfigs} />}
       </Card>
   );
};


// --- Dashboard View Components ---


const mockDashboardData = {
   timeSeries: Array.from({length: 7}, (_, i) => {
       const date = new Date();
       date.setDate(date.getDate() - (6 - i));
       return {
           date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
           Alert: 4000 + Math.random() * 1500,
           Deny: 2400 + Math.random() * 1000,
       };
   }),
   triggeredByRule: [
       { name: 'Prompt Injection', value: 456 },
       { name: 'PII in Output', value: 312 },
       { name: 'Code Detected', value: 254 },
       { name: 'Toxic Content', value: 189 },
       { name: 'PII in Input', value: 98 },
   ],
   llmAndAttackTypes: [
       { name: 'LLM + SQLi', value: 400 },
       { name: 'LLM + XSS', value: 300 },
       { name: 'LLM + Bot', value: 300 },
       { name: 'LLM Only', value: 200 },
   ],
   appDetections: [
       { id: 1, appName: 'Customer Service Bot', uniqueRules: 5, triggeredRequests: 12543 },
       { id: 2, appName: 'Internal Knowledge Base', uniqueRules: 2, triggeredRequests: 4321 },
   ]
};


const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];


const CustomTooltip = ({ active, payload, label }) => {
 if (active && payload && payload.length) {
   return (
     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
       <p className="label font-bold text-gray-900 dark:text-white">{`${label}`}</p>
       {payload.map((p, i) => (
           <p key={i} style={{ color: p.color }} className="intro">{`${p.name}: ${p.value.toLocaleString()}`}</p>
       ))}
     </div>
   );
 }
 return null;
};


const DashboardView = ({ firewallConfigs, apps }) => {
   const [viewMode, setViewMode] = useState('chart');


   return (
       <div className="space-y-6">
           {/* Filters */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Select options={firewallConfigs.map(c => ({ value: c.id, label: c.name }))} onChange={() => {}}/>
               <Select options={[
                   { value: '7d', label: 'Last 7 Days' },
                   { value: '30d', label: 'Last 30 Days' },
                   { value: '90d', label: 'Last 90 Days' },
               ]} onChange={() => {}}/>
               <Select options={[
                   { value: 'both', label: 'Input & Output Requests' },
                   { value: 'input', label: 'Input Only' },
                   { value: 'output', label: 'Output Only' },
               ]} onChange={() => {}}/>
           </div>


           {/* Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="p-6">
                   <div className="flex items-center">
                       <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Requests</h3>
                       <TooltipIcon text="All requests evaluated by Firewall for AI detections." />
                   </div>
                   <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">1,234,567</p>
               </Card>
               <Card className="p-6">
                    <div className="flex items-center">
                       <h3 className="text-gray-500 dark:text-gray-400 font-medium">Triggered Requests</h3>
                       <TooltipIcon text="Requests that violated rules you set in place for the selected Firewall for AI configuration." />
                   </div>
                   <p className="text-4xl font-bold text-red-500 dark:text-red-400 mt-2">16,864</p>
               </Card>
               <Card className="p-6">
                   <div className="flex items-center">
                       <h3 className="text-gray-500 dark:text-gray-400 font-medium">Approved Requests</h3>
                       <TooltipIcon text="Requests that violated no rules and went through without triggering response actions." />
                   </div>
                   <p className="text-4xl font-bold text-green-500 dark:text-green-400 mt-2">1,217,703</p>
               </Card>
           </div>


           {/* Charts */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card>
                   <CardHeader title="Triggered Requests by Action" />
                   <div className="p-4 h-80">
                       <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={mockDashboardData.timeSeries}>
                               <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                               <XAxis dataKey="date" tick={{ fill: 'currentColor' }} className="text-xs"/>
                               <YAxis tick={{ fill: 'currentColor' }} className="text-xs"/>
                               <Tooltip content={<CustomTooltip />}/>
                               <Legend />
                               <Line type="monotone" dataKey="Alert" stroke="#f59e0b" strokeWidth={2} />
                               <Line type="monotone" dataKey="Deny" stroke="#ef4444" strokeWidth={2}/>
                           </LineChart>
                       </ResponsiveContainer>
                   </div>
               </Card>
               <Card>
                   <CardHeader title="Triggered Requests by Rule" />
                   <div className="p-4 h-80">
                       <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={mockDashboardData.triggeredByRule} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                               <XAxis type="number" tick={{ fill: 'currentColor' }} className="text-xs"/>
                               <YAxis type="category" dataKey="name" tick={{ fill: 'currentColor' }} className="text-xs" width={120}/>
                               <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(128, 128, 128, 0.1)'}}/>
                               <Bar dataKey="value" fill="#8884d8" />
                           </BarChart>
                       </ResponsiveContainer>
                   </div>
               </Card>
                <Card>
                   <CardHeader title="LLM & Other Attack Types" />
                   <div className="p-4 h-80">
                       <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                               <Pie data={mockDashboardData.llmAndAttackTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                   {mockDashboardData.llmAndAttackTypes.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                   ))}
                               </Pie>
                               <Tooltip content={<CustomTooltip />}/>
                               <Legend />
                           </PieChart>
                       </ResponsiveContainer>
                   </div>
               </Card>
                <Card>
                   <CardHeader title="Detections by Application">
                       <Button variant="ghost" className="!p-2"><Download size={16}/></Button>
                   </CardHeader>
                   <div className="p-4 h-80 overflow-y-auto">
                       <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                               <tr>
                                   <th scope="col" className="px-6 py-3">Application Name</th>
                                   <th scope="col" className="px-6 py-3">Unique Rules</th>
                                   <th scope="col" className="px-6 py-3">Triggered Requests</th>
                               </tr>
                           </thead>
                           <tbody>
                               {apps.map(app => {
                                   const detectionData = mockDashboardData.appDetections.find(d => d.id === app.id) || {uniqueRules: 0, triggeredRequests: 0};
                                   return (
                                       <tr key={app.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/30">
                                           <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{app.appName}</th>
                                           <td className="px-6 py-4">{detectionData.uniqueRules}</td>
                                           <td className="px-6 py-4">{detectionData.triggeredRequests.toLocaleString()}</td>
                                       </tr>
                                   )
                               })}
                           </tbody>
                       </table>
                   </div>
               </Card>
           </div>
       </div>
   );
};




// --- Main App Component ---


export default function App() {
   const [activeView, setActiveView] = useState('dashboard');
   const [showSavedMessage, setShowSavedMessage] = useState(false);


   // Mock active firewall configurations
   const firewallConfigs = [
       { id: 'prod-rules-v1', name: 'Production Rules v1.2' },
       { id: 'staging-rules-v1', name: 'Staging Rules v1.5 (Alert Only)' },
       { id: 'dev-rules-v1', name: 'Developer Test Rules' },
   ];
  
   const [apps, setApps] = useState([
       { id: 1, appName: 'Customer Service Bot', description: 'Primary chatbot for customer support', tags: ['chatbot', 'support', 'production'], firewallConfigId: 'prod-rules-v1', sampleRate: 100, endpoints: [{ hostnames: 'chatbot.example.com', path: '/v1/chat' }], checkInput: true, checkOutput: true, inputJsonPath: '$.prompt', inputMaxLength: '8000', inputEncoding: 'None', outputJsonPath: '$.completion', outputMaxLength: '8000', outputEncoding: 'None' },
       { id: 2, appName: 'Internal Knowledge Base', description: 'Internal Q&A for employees', tags: ['internal', 'hr'], firewallConfigId: 'staging-rules-v1', sampleRate: 100, endpoints: [{ hostnames: 'kb.corp.example.com', path: '/api/ask' }], checkInput: true, checkOutput: false, inputJsonPath: '$.question', inputMaxLength: '2000', inputEncoding: 'None', outputJsonPath: '', outputMaxLength: '', outputEncoding: 'None' }
   ]);


   const handleSaveChanges = (data) => {
       console.log(`Saving ${activeView}:`, JSON.stringify(data, null, 2));
       setShowSavedMessage(true);
       setTimeout(() => setShowSavedMessage(false), 3000);
   };


   const TabButton = ({ view, children }) => (
       <button
           onClick={() => setActiveView(view)}
           className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${activeView === view ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
       >
           {children}
       </button>
   );


   return (
       <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
           <div className="container mx-auto p-4 sm:p-6 lg:p-8">
               <div className="mb-6 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm inline-flex space-x-2">
                   <TabButton view="dashboard"><BarChart2 size={16} /><span>Dashboard</span></TabButton>
                   <TabButton view="rules"><Shield size={16} /><span>Firewall Rules</span></TabButton>
                   <TabButton view="apps"><Server size={16} /><span>Applied Applications</span></TabButton>
               </div>


               {activeView === 'dashboard' && <DashboardView firewallConfigs={firewallConfigs} apps={apps} />}
               {activeView === 'rules' && <FirewallRulesView showSavedMessage={showSavedMessage} handleSaveChanges={handleSaveChanges} />}
               {activeView === 'apps' && <AppliedAppsView showSavedMessage={showSavedMessage} handleSaveChanges={handleSaveChanges} firewallConfigs={firewallConfigs} apps={apps} setApps={setApps} />}


               <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                   <p>AI Firewall Configuration | Inspired by Akamai Firewall for AI</p>
               </footer>
           </div>
       </div>
   );
}




