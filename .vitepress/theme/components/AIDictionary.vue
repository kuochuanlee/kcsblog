<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Term {
  a: string; // 縮寫
  f: string; // 全名
  zh: string; // 中文說明
  cat: 'model' | 'arch' | 'training' | 'data' | 'eval' | 'agent' | 'infra';
}

const searchQuery = ref('')
const currentCat = ref('all')

const agData: Term[] = [
  {a:'LLM',f:'Large Language Model',zh:'大型語言模型，使用海量文字訓練的預測下一個詞語的神經網路。GPT、Claude、Gemini 皆屬此類。',cat:'model'},
  {a:'SLM',f:'Small Language Model',zh:'小型語言模型，參數量較少、可在邊緣裝置執行的語言模型，如 Phi、Mistral 7B。',cat:'model'},
  {a:'VLM',f:'Vision-Language Model',zh:'視覺語言模型，同時理解圖片與文字，可進行圖文問答、圖像描述。',cat:'model'},
  {a:'FM',f:'Foundation Model',zh:'基礎模型，在大規模資料上預訓練、可微調用於多種下游任務的通用模型。',cat:'model'},
  {a:'MLLM',f:'Multimodal Large Language Model',zh:'多模態大型語言模型，能同時處理文字、圖片、音訊等多種輸入類型。',cat:'model'},
  {a:'GPT',f:'Generative Pre-trained Transformer',zh:'生成式預訓練 Transformer，OpenAI 開發的自迴歸語言模型系列。',cat:'model'},
  {a:'BERT',f:'Bidirectional Encoder Representations from Transformers',zh:'雙向 Transformer 編碼器表示，Google 開發，透過遮罩語言模型方式學習深層語境。',cat:'model'},
  {a:'T5',f:'Text-to-Text Transfer Transformer',zh:'文字對文字遷移 Transformer，將所有 NLP 任務統一為文字輸入輸出的格式。',cat:'model'},
  {a:'MHA',f:'Multi-Head Attention',zh:'多頭注意力，Transformer 的核心機制，同時從多個子空間關注不同的上下文關係。',cat:'arch'},
  {a:'MQA',f:'Multi-Query Attention',zh:'多查詢注意力，所有頭共享同一組 Key/Value，大幅降低推理時的 KV Cache 記憶體需求。',cat:'arch'},
  {a:'GQA',f:'Grouped-Query Attention',zh:'分組查詢注意力，介於 MHA 與 MQA 之間，多個查詢頭共享一組 KV，兼顧效能與品質。',cat:'arch'},
  {a:'FFN',f:'Feed-Forward Network',zh:'前饋網路，Transformer 每層中在注意力之後的兩層全連接網路。',cat:'arch'},
  {a:'MoE',f:'Mixture of Experts',zh:'專家混合，模型內有多個「專家」子網路，每次推理只啟動部分，以少量計算實現大參數規模。',cat:'arch'},
  {a:'RNN',f:'Recurrent Neural Network',zh:'遞迴神經網路，依序處理時間序列，隱含狀態傳遞前後文；現多被 Transformer 取代。',cat:'arch'},
  {a:'LSTM',f:'Long Short-Term Memory',zh:'長短期記憶，RNN 的改良版，透過閘控機制緩解梯度消失問題，善於捕捉長距離依賴。',cat:'arch'},
  {a:'CNN',f:'Convolutional Neural Network',zh:'卷積神經網路，透過滑動卷積核提取局部特徵，廣泛用於圖像識別。',cat:'arch'},
  {a:'GAN',f:'Generative Adversarial Network',zh:'生成對抗網路，生成器與判別器互相博弈，生成逼真圖片或資料。',cat:'arch'},
  {a:'VAE',f:'Variational Autoencoder',zh:'變分自編碼器，學習資料的潛在分佈，能生成與訓練資料風格相似的新樣本。',cat:'arch'},
  {a:'ViT',f:'Vision Transformer',zh:'視覺 Transformer，將圖片切成 patch 後作為序列輸入 Transformer，取代 CNN 進行圖像分類。',cat:'arch'},
  {a:'SSM',f:'State Space Model',zh:'狀態空間模型，Mamba 等模型採用的線性遞迴架構，在長序列上比 Transformer 更省記憶體。',cat:'arch'},
  {a:'SFT',f:'Supervised Fine-Tuning',zh:'監督式微調，使用人工標注的輸入輸出對，進一步訓練預訓練模型以符合特定任務。',cat:'training'},
  {a:'RLHF',f:'Reinforcement Learning from Human Feedback',zh:'人類回饋強化學習，依照人類對輸出的偏好評分訓練獎勵模型，再用 PPO 最佳化語言模型。',cat:'training'},
  {a:'RLAIF',f:'Reinforcement Learning from AI Feedback',zh:'AI 回饋強化學習，以另一個 AI 模型取代人類提供偏好標注，降低人力成本。',cat:'training'},
  {a:'DPO',f:'Direct Preference Optimization',zh:'直接偏好最佳化，不需獨立訓練獎勵模型，直接從偏好對比資料微調語言模型。',cat:'training'},
  {a:'PPO',f:'Proximal Policy Optimization',zh:'近端策略最佳化，RLHF 中常用的強化學習演算法，限制每次更新幅度以穩定訓練。',cat:'training'},
  {a:'LoRA',f:'Low-Rank Adaptation',zh:'凍結原始權重，僅訓練低秩矩陣插入層，以極少參數實現高效微調。',cat:'training'},
  {a:'QLoRA',f:'Quantized Low-Rank Adaptation',zh:'量化低秩適應，將基礎模型量化為 4-bit，再套用 LoRA，可在消費級 GPU 微調大型模型。',cat:'training'},
  {a:'PEFT',f:'Parameter-Efficient Fine-Tuning',zh:'參數高效微調，涵蓋 LoRA、Adapter、Prompt Tuning 等只更新少量參數的微調方法總稱。',cat:'training'},
  {a:'KD',f:'Knowledge Distillation',zh:'知識蒸餾，讓小模型（學生）模仿大模型（教師）的輸出分佈，在較少計算量下保留能力。',cat:'training'},
  {a:'SGD',f:'Stochastic Gradient Descent',zh:'隨機梯度下降，每次更新只使用一個或小批量樣本計算梯度，是深度學習最基礎的最佳化方法。',cat:'training'},
  {a:'AdamW',f:'Adam with Weight Decay',zh:'帶權重衰減的 Adam 最佳化器，目前訓練 Transformer 的主流選擇，結合動量與自適應學習率。',cat:'training'},
  {a:'NLP',f:'Natural Language Processing',zh:'自然語言處理，讓電腦理解、生成和操作人類語言的 AI 子領域。',cat:'data'},
  {a:'NLU',f:'Natural Language Understanding',zh:'自然語言理解，NLP 的子任務，專注於讓機器理解句子的語意、意圖與情感。',cat:'data'},
  {a:'NLG',f:'Natural Language Generation',zh:'自然語言生成，從結構化資料或模型狀態自動產生可讀文字。',cat:'data'},
  {a:'NER',f:'Named Entity Recognition',zh:'命名實體識別，從文字中識別人名、地名、組織名等具體實體。',cat:'data'},
  {a:'POS',f:'Part-of-Speech Tagging',zh:'詞性標注，為句子中的每個詞標記名詞、動詞、形容詞等語法角色。',cat:'data'},
  {a:'BPE',f:'Byte Pair Encoding',zh:'位元組對編碼，一種子詞分詞演算法，透過合併高頻字符對來建立詞彙表，GPT 系列採用。',cat:'data'},
  {a:'TF-IDF',f:'Term Frequency–Inverse Document Frequency',zh:'詞頻—逆文件頻率，衡量詞語在文件中的重要性，常用於資訊檢索與關鍵字提取。',cat:'data'},
  {a:'CoT',f:'Chain of Thought',zh:'思維鏈，引導模型逐步顯示推理過程，顯著提升複雜數學與邏輯任務的準確率。',cat:'eval'},
  {a:'ToT',f:'Tree of Thoughts',zh:'思維樹，擴展 CoT，讓模型探索多條推理分支並剪枝，適用於需要規劃的問題。',cat:'eval'},
  {a:'RAG',f:'Retrieval-Augmented Generation',zh:'檢索增強生成，生成回應前先從外部知識庫檢索相關文件，降低幻覺並注入最新知識。',cat:'eval'},
  {a:'BLEU',f:'Bilingual Evaluation Understudy',zh:'機器翻譯自動評估指標，比較模型輸出與參考譯文的 n-gram 重疊程度。',cat:'eval'},
  {a:'ROUGE',f:'Recall-Oriented Understudy for Gisting Evaluation',zh:'摘要評估指標系列，衡量系統摘要與參考摘要之間的 n-gram 召回率。',cat:'eval'},
  {a:'BERTScore',f:'BERT-based Evaluation Metric',zh:'基於 BERT 嵌入的文字相似度評估指標，比 BLEU 更能捕捉語意層面的一致性。',cat:'eval'},
  {a:'MMLU',f:'Massive Multitask Language Understanding',zh:'大規模多任務語言理解基準，涵蓋 57 個學科的四選一選擇題，用於測試模型的知識廣度。',cat:'eval'},
  {a:'HHH',f:'Helpful, Harmless, and Honest',zh:'有益、無害、誠實，Anthropic 定義的 AI 助手三大核心對齊目標。',cat:'eval'},
  {a:'ARC',f:'AI2 Reasoning Challenge',zh:'AI2 推理挑戰，涵蓋小學科學題的常識推理基準測試集。',cat:'eval'},
  {a:'MCP',f:'Model Context Protocol',zh:'模型上下文協議，Anthropic 提出的開放標準，讓 AI 模型透過統一介面連接外部工具與資料來源。',cat:'agent'},
  {a:'ReAct',f:'Reasoning + Acting',zh:'推理加行動，讓 LLM 交替產生思考步驟與工具呼叫，用於構建能執行任務的 Agent。',cat:'agent'},
  {a:'ACI',f:'Agent-Computer Interface',zh:'智能體電腦介面，為 AI Agent 設計的工具、動作空間與回饋機制的統稱。',cat:'agent'},
  {a:'HITL',f:'Human-in-the-Loop',zh:'人機協作迴圈，在 AI 自動化流程中保留人類審核或干預的節點，提升安全性。',cat:'agent'},
  {a:'GPU',f:'Graphics Processing Unit',zh:'圖形處理器，因其大規模平行計算能力，成為深度學習訓練與推理的主要硬體。',cat:'infra'},
  {a:'TPU',f:'Tensor Processing Unit',zh:'張量處理器，Google 為機器學習工作負載專門設計的 ASIC 晶片。',cat:'infra'},
  {a:'FP16',f:'16-bit Floating Point',zh:'半精度浮點，相比 FP32 節省一半記憶體，用於混合精度訓練以加速運算。',cat:'infra'},
  {a:'BF16',f:'Brain Floating Point 16',zh:'大腦浮點 16，Google 提出的 16-bit 格式，動態範圍與 FP32 相同，訓練穩定性優於 FP16。',cat:'infra'},
  {a:'INT8',f:'8-bit Integer Quantization',zh:'8-bit 整數量化，將模型權重從浮點壓縮為 8-bit 整數，推理速度更快、記憶體需求減半。',cat:'infra'},
  {a:'KV Cache',f:'Key-Value Cache',zh:'鍵值快取，推理時快取已計算的注意力 Key/Value，避免重複計算，大幅提升解碼速度。',cat:'infra'},
  {a:'VRAM',f:'Video Random Access Memory',zh:'顯示記憶體，GPU 上用於儲存模型權重、啟動值與 KV Cache 的高頻寬記憶體。',cat:'infra'},
  {a:'ONNX',f:'Open Neural Network Exchange',zh:'開放神經網路交換格式，跨框架部署 AI 模型的通用格式標準。',cat:'infra'},
  {a:'FLOP',f:'Floating Point Operation',zh:'浮點運算次數，衡量模型訓練或推理計算量的基本單位，常以 FLOPs（複數）表示總量。',cat:'infra'}
];

const agCatMeta = {
  model: '模型',
  arch: '架構',
  training: '訓練',
  data: '資料/NLP',
  eval: '評估',
  agent: 'Agent',
  infra: '基礎設施'
}

const filteredData = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return agData.filter(d => {
    const matchesCat = currentCat.value === 'all' || d.cat === currentCat.value
    if (!matchesCat) return false
    if (!q) return true
    return d.a.toLowerCase().includes(q) || d.f.toLowerCase().includes(q) || d.zh.includes(q)
  })
})

function highlight(text: string) {
  const q = searchQuery.value.trim()
  if (!q) return text
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

function selectCat(cat: string) {
  currentCat.value = cat
}
</script>

<template>
  <div class="ag-wrap">
    <div class="ag-search">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="6.5" cy="6.5" r="4.5"/>
        <path d="M10.5 10.5L14 14" stroke-linecap="round"/>
      </svg>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="搜尋縮寫、全名或說明…"
      >
    </div>

    <div class="ag-cats">
      <button 
        class="ag-btn" 
        :class="{ active: currentCat === 'all' }"
        @click="selectCat('all')"
      >
        全部
      </button>
      <button 
        v-for="(label, key) in agCatMeta" 
        :key="key"
        class="ag-btn"
        :class="{ active: currentCat === key }"
        @click="selectCat(key)"
      >
        {{ label }}
      </button>
    </div>

    <div class="ag-count">// {{ filteredData.length }} 個術語</div>

    <div class="ag-table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width: 100px">縮寫 / 全名</th>
            <th>中文說明</th>
            <th style="width: 90px">類別</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredData" :key="item.a">
            <td>
              <div class="abbr" v-html="highlight(item.a)"></div>
              <div class="full" v-html="highlight(item.f)"></div>
            </td>
            <td class="zh" v-html="highlight(item.zh)"></td>
            <td>
              <span :class="['tag', `tag-${item.cat}`]">
                {{ agCatMeta[item.cat] }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="3">
              <div class="empty">找不到結果</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.ag-wrap {
  font-family: var(--vp-font-family-base);
  max-width: 100%;
  margin: 2rem 0;
}

.ag-search {
  position: relative;
  margin-bottom: 1rem;
}

.ag-search svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.ag-search input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}

.ag-search input:focus {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
}

.ag-cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
}

.ag-btn {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.ag-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ag-btn.active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
}

.ag-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 12px;
  font-family: var(--vp-font-family-mono);
}

.ag-table-wrap {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow-x: auto;
  background-color: var(--vp-c-bg-soft);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 !important; /* 覆蓋 VitePress 預設邊距 */
}

thead tr {
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
}

th {
  padding: 12px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  font-weight: 600;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.1s;
}

tbody tr:last-child {
  border-bottom: none;
}

tbody tr:hover {
  background-color: var(--vp-c-bg-mute);
}

td {
  padding: 12px;
  vertical-align: top;
}

.abbr {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.full {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-style: italic;
  margin-top: 2px;
}

.zh {
  font-size: 13px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

/* 類別標籤顏色 */
.tag-model { background: #eeedfe; color: #3c3489; }
.tag-arch { background: #faece7; color: #4a1b0c; }
.tag-training { background: #e1f5ee; color: #085041; }
.tag-data { background: #faeeda; color: #412402; }
.tag-eval { background: #fbeaf0; color: #4b1528; }
.tag-agent { background: #e6f1fb; color: #0c447c; }
.tag-infra { background: #f1efe8; color: #2c2c2a; }

:deep(mark) {
  background: rgba(124, 106, 247, 0.2);
  color: var(--vp-c-brand-1);
  border-radius: 2px;
  padding: 0 2px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

/* 響應式調整 */
@media (max-width: 640px) {
  th:nth-child(3), td:nth-child(3) {
    display: none; /* 小螢幕隱藏類別欄位以節省空間 */
  }
}
</style>
