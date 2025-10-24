import Anthropic from '@anthropic-ai/sdk';

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 1000;
    
    // Fallback hints in Italian for when Claude API fails
    this.fallbackHints = {
      1: "Inizia isolando il termine con la variabile x. Sposta i numeri dall'altra parte dell'operatore.",
      2: "Ricorda: quando dividi o moltiplichi per un numero negativo, devi invertire il segno della disequazione.",
      3: "Risolvi passo dopo passo: prima sottrai o aggiungi i termini costanti, poi dividi per il coefficiente di x."
    };
  }

  /**
   * Generate a progressive hint based on the inequality and number of hints already used
   * @param {string} inequality - The inequality to solve (e.g., "2x + 5 > 13")
   * @param {number} hintsUsed - Number of hints already provided (0, 1, or 2)
   * @returns {Promise<string>} - The hint in Italian
   */
  async generateHint(inequality, hintsUsed = 0) {
    // Validate inputs
    if (!inequality || typeof inequality !== 'string') {
      throw new Error('Invalid inequality provided');
    }

    if (hintsUsed < 0 || hintsUsed >= 3) {
      throw new Error('Invalid hintsUsed value. Must be between 0 and 2');
    }

    try {
      const prompt = this.buildPrompt(inequality, hintsUsed);
      
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Extract the hint from Claude's response
      const hint = message.content[0].text.trim();
      
      return hint;
    } catch (error) {
      console.error('Claude API error:', error.message);
      
      // Return fallback hint if API fails
      return this.getFallbackHint(hintsUsed + 1);
    }
  }

  /**
   * Build the prompt for Claude based on hint level
   * @param {string} inequality - The inequality to solve
   * @param {number} hintsUsed - Number of hints already used
   * @returns {string} - The prompt in Italian
   */
  buildPrompt(inequality, hintsUsed) {
    const hintLevel = hintsUsed + 1;
    
    const baseContext = `Sei un tutor di matematica che aiuta gli studenti a risolvere disequazioni lineari. 
La disequazione da risolvere è: ${inequality}

Fornisci un indizio in italiano che aiuti lo studente a progredire nella soluzione.`;

    switch (hintLevel) {
      case 1:
        // First hint: General approach
        return `${baseContext}

Questo è il PRIMO indizio. Fornisci un suggerimento generale sull'approccio da seguire per risolvere questa disequazione. 
Non dare la soluzione completa, ma indica quale dovrebbe essere il primo passo.
Mantieni l'indizio breve (massimo 2-3 frasi).`;

      case 2:
        // Second hint: First step with explanation
        return `${baseContext}

Questo è il SECONDO indizio. Lo studente ha già ricevuto un suggerimento generale.
Ora fornisci il primo passo concreto della soluzione con una breve spiegazione del perché si fa questo passo.
Mostra l'operazione da eseguire ma non completare tutta la soluzione.
Mantieni l'indizio breve (massimo 3-4 frasi).`;

      case 3:
        // Third hint: Detailed step-by-step
        return `${baseContext}

Questo è il TERZO e ULTIMO indizio. Lo studente ha bisogno di una guida più dettagliata.
Fornisci una soluzione passo dopo passo completa, spiegando ogni passaggio.
Includi tutti i passaggi intermedi e la soluzione finale.
Ricorda di menzionare quando è necessario invertire il segno della disequazione (se si divide/moltiplica per un numero negativo).`;

      default:
        return baseContext;
    }
  }

  /**
   * Get a fallback hint when Claude API is unavailable
   * @param {number} hintLevel - The hint level (1, 2, or 3)
   * @returns {string} - Fallback hint in Italian
   */
  getFallbackHint(hintLevel) {
    return this.fallbackHints[hintLevel] || this.fallbackHints[1];
  }

  /**
   * Generate a linear inequality puzzle using Claude
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   * @returns {Promise<Object>} - Puzzle object with inequality and solution
   */
  async generatePuzzle(difficulty = 'easy') {
    const difficultyDescriptions = {
      easy: 'facile (coefficienti piccoli, numeri positivi, operazioni semplici)',
      medium: 'medio (coefficienti più grandi, possibili numeri negativi)',
      hard: 'difficile (coefficienti negativi, numeri grandi, operazioni complesse)'
    };

    const prompt = `Genera una disequazione lineare di primo grado (con una sola variabile x) di livello ${difficultyDescriptions[difficulty]}.

Requisiti:
1. La disequazione deve essere nel formato: ax + b [operatore] c
2. Usa uno di questi operatori: >, <, ≥, ≤
3. I coefficienti devono essere numeri interi (non zero per 'a')
4. La disequazione deve avere una soluzione unica e ben definita
5. Per livello facile: usa coefficienti tra -5 e 5 (escluso 0)
6. Per livello medio: usa coefficienti tra -10 e 10 (escluso 0)
7. Per livello difficile: usa coefficienti tra -15 e 15 (escluso 0), preferibilmente con numeri negativi

Rispondi SOLO con un oggetto JSON in questo formato esatto (senza markdown, senza spiegazioni):
{
  "inequality": "la disequazione (es: 2x + 5 > 13)",
  "solution": "la soluzione (es: x > 4)",
  "steps": ["passo 1", "passo 2", "passo 3"]
}

Ricorda: se dividi o moltiplichi per un numero negativo, devi invertire il segno della disequazione.`;

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const responseText = message.content[0].text.trim();
      
      // Parse JSON response
      // Remove markdown code blocks if present
      const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const puzzleData = JSON.parse(jsonText);
      
      return {
        inequality: puzzleData.inequality,
        solution: puzzleData.solution,
        steps: puzzleData.steps || []
      };
    } catch (error) {
      console.error('Claude puzzle generation error:', error.message);
      // Return null to fall back to algorithmic generation
      return null;
    }
  }

  /**
   * Check if the Claude API is properly configured
   * @returns {boolean} - True if API key is set
   */
  isConfigured() {
    return !!process.env.ANTHROPIC_API_KEY;
  }
}

export default ClaudeService;
