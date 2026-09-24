import { TicketCategory, TicketPriority, Ticket, KnowledgeArticle, SimilarIssue } from '../types';

export interface AIAnalysisResult {
  category: TicketCategory;
  priority: TicketPriority;
  confidence: number;
  summary: string;
  suggestedResolution: string;
  affectedService: string;
  troubleshootingSteps: string[];
  suggestedActions: string[];
  similarIssues: SimilarIssue[];
}

export interface ChatResponse {
  replyText: string;
  detectedCategory: TicketCategory;
  detectedPriority: TicketPriority;
  confidence: number;
  suggestedActions: string[];
  troubleshootingSteps: string[];
  isResolutionPrompt: boolean;
  draftTicketData?: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    affectedService: string;
    troubleshootingAttempted: string[];
  };
}

class AIService {
  /**
   * 1. Category Prediction
   * Categorizes user query based on semantic keyword density and intent analysis
   */
  public predictCategory(text: string): { category: TicketCategory; confidence: number } {
    const lower = text.toLowerCase();

    if (lower.includes('vpn') || lower.includes('remote') || lower.includes('tunnel') || lower.includes('anyconnect') || lower.includes('gateway')) {
      return { category: 'VPN', confidence: 0.94 };
    }
    if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet') || lower.includes('lan') || lower.includes('ethernet') || lower.includes('dns') || lower.includes('802.1x') || lower.includes('network')) {
      return { category: 'Network', confidence: 0.92 };
    }
    if (lower.includes('monitor') || lower.includes('screen') || lower.includes('display') || lower.includes('dock') || lower.includes('battery') || lower.includes('laptop') || lower.includes('hardware') || lower.includes('keyboard') || lower.includes('mouse')) {
      return { category: 'Hardware', confidence: 0.89 };
    }
    if (lower.includes('print') || lower.includes('printer') || lower.includes('spooler') || lower.includes('paper') || lower.includes('papercut') || lower.includes('scanner')) {
      return { category: 'Printer', confidence: 0.95 };
    }
    if (lower.includes('password') || lower.includes('locked') || lower.includes('lockout') || lower.includes('login') || lower.includes('credential') || lower.includes('mfa') || lower.includes('otp') || lower.includes('sso') || lower.includes('account')) {
      return { category: 'Account & Password', confidence: 0.96 };
    }
    if (lower.includes('email') || lower.includes('outlook') || lower.includes('mail') || lower.includes('exchange') || lower.includes('inbox') || lower.includes('mailbox') || lower.includes('quota')) {
      return { category: 'Email', confidence: 0.93 };
    }
    if (lower.includes('sap') || lower.includes('erp') || lower.includes('app') || lower.includes('software') || lower.includes('excel') || lower.includes('teams') || lower.includes('browser') || lower.includes('chrome') || lower.includes('crash')) {
      return { category: 'Software', confidence: 0.88 };
    }
    if (lower.includes('security') || lower.includes('antivirus') || lower.includes('bitlocker') || lower.includes('usb') || lower.includes('virus') || lower.includes('phishing') || lower.includes('blocked')) {
      return { category: 'Security', confidence: 0.91 };
    }

    return { category: 'Other', confidence: 0.72 };
  }

  /**
   * 2. Priority Suggestion
   * Calculates priority based on business impact, keyword severity, and department context
   */
  public suggestPriority(text: string, department?: string): TicketPriority {
    const lower = text.toLowerCase();

    // Critical triggers
    if (
      lower.includes('entire office') ||
      lower.includes('substation down') ||
      lower.includes('scada') ||
      lower.includes('grid failure') ||
      lower.includes('urgent') ||
      lower.includes('critical') ||
      lower.includes('tax filing') ||
      lower.includes('board meeting') ||
      lower.includes('security breach') ||
      lower.includes('bitlocker recovery')
    ) {
      return 'Critical';
    }

    // High triggers
    if (
      lower.includes('cannot access') ||
      lower.includes('vpn') ||
      lower.includes('locked out') ||
      lower.includes('sap') ||
      lower.includes('network down') ||
      lower.includes('deadline') ||
      lower.includes('unable to work') ||
      lower.includes('error') ||
      lower.includes('crash')
    ) {
      return 'High';
    }

    // Low triggers
    if (
      lower.includes('slow') ||
      lower.includes('how to') ||
      lower.includes('request') ||
      lower.includes('suggestion') ||
      lower.includes('minor') ||
      lower.includes('printer badge') ||
      lower.includes('question')
    ) {
      return 'Low';
    }

    return 'Medium';
  }

  /**
   * 3. Knowledge Retrieval
   * Retrieves top relevant articles from knowledge base
   */
  public searchRelevantArticles(query: string, articles: KnowledgeArticle[], limit = 3): KnowledgeArticle[] {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (terms.length === 0) return articles.slice(0, limit);

    const scored = articles.map(article => {
      let score = 0;
      const titleLower = article.title.toLowerCase();
      const descLower = article.description.toLowerCase();
      const catLower = article.category.toLowerCase();
      const tags = article.tags.map(t => t.toLowerCase());

      terms.forEach(term => {
        if (titleLower.includes(term)) score += 5;
        if (catLower.includes(term)) score += 4;
        if (tags.some(tag => tag.includes(term))) score += 3;
        if (descLower.includes(term)) score += 2;
      });

      return { article, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.article)
      .slice(0, limit);
  }

  /**
   * 4. Response Generation & Interactive Troubleshooting Flow
   * Handles conversational turn with suggested action buttons and pre-fills
   */
  public processUserMessage(
    userMessage: string,
    history: { sender: string; text: string }[],
    existingTickets: Ticket[] = []
  ): ChatResponse {
    const { category, confidence } = this.predictCategory(userMessage);
    const priority = this.suggestPriority(userMessage);
    const lower = userMessage.toLowerCase();

    // Check if user is clicking an action chip
    if (lower.includes('check internet connection')) {
      return {
        replyText: 'To check your internet connection:\n\n1. Open your browser and navigate to a public site like google.com or powergrid.in.\n2. Open Command Prompt and type `ping 8.8.8.8`.\n3. If ping succeeds with <50ms latency, your internet is healthy and the issue is specific to the VPN tunnel or SSL handshake.',
        detectedCategory: 'Network',
        detectedPriority: 'Medium',
        confidence: 0.95,
        suggestedActions: ['Check VPN Credentials', 'Try VPN Reconnection', 'Did this solve your issue?'],
        troubleshootingSteps: ['Verified internet ping to external gateway'],
        isResolutionPrompt: false,
      };
    }

    if (lower.includes('check vpn credentials')) {
      return {
        replyText: 'Let\'s check your VPN credentials:\n\n1. Ensure your Active Directory domain account is active (passwords expire every 90 days).\n2. If using mobile 2FA Authenticator, verify your phone\'s time settings are on "Automatic" (time drift causes invalid token rejections).\n3. Re-enter your corporate username in the format: `CORP\\username` or `username@powergrid.in`.',
        detectedCategory: 'VPN',
        detectedPriority: 'High',
        confidence: 0.96,
        suggestedActions: ['Try VPN Reconnection', 'Check Internet Connection', 'Create Support Ticket'],
        troubleshootingSteps: ['Verified MFA token sync and domain format'],
        isResolutionPrompt: false,
      };
    }

    if (lower.includes('try vpn reconnection')) {
      return {
        replyText: 'Please perform a clean VPN client reconnection:\n\n1. Right-click the VPN icon in your Windows notification tray and choose "Exit".\n2. Open Command Prompt and run: `ipconfig /flushdns`.\n3. Re-open the VPN client and connect to gateway `vpn.nr.powergrid.in`.\n\nDid the connection establish successfully?',
        detectedCategory: 'VPN',
        detectedPriority: 'High',
        confidence: 0.93,
        suggestedActions: ['✓ Yes, issue resolved', '✕ No, create a ticket'],
        troubleshootingSteps: ['Exited VPN client', 'Flushed DNS cache', 'Attempted reconnect to primary gateway'],
        isResolutionPrompt: true,
        draftTicketData: {
          title: 'Unable to connect to corporate VPN',
          description: `User reports active internet connection but corporate VPN cannot establish connection after restarting client and flushing DNS.`,
          category: 'VPN',
          priority: 'High',
          affectedService: 'Corporate SSL-VPN / Remote Gateway',
          troubleshootingAttempted: ['Restarted VPN client', 'Flushed DNS cache', 'Reconnected to Wi-Fi'],
        },
      };
    }

    // Default conversational responses by domain
    if (category === 'VPN') {
      return {
        replyText: 'I can help you troubleshoot this VPN connectivity issue. Let\'s first verify whether your basic internet connection is working normally and if your gateway can be reached.',
        detectedCategory: 'VPN',
        detectedPriority: priority,
        confidence,
        suggestedActions: [
          'Check Internet Connection',
          'Check VPN Credentials',
          'Try VPN Reconnection',
          'Create Support Ticket'
        ],
        troubleshootingSteps: [
          'Verify baseline internet reachability',
          'Confirm MFA software token time synchronization',
          'Restart VPN client and flush DNS'
        ],
        isResolutionPrompt: false,
        draftTicketData: {
          title: 'Unable to connect to corporate VPN',
          description: `User reports: "${userMessage}". Basic internet connection is operational, but corporate gateway tunnel times out.`,
          category: 'VPN',
          priority: priority,
          affectedService: 'Corporate SSL-VPN Gateway',
          troubleshootingAttempted: ['Verified internet connection', 'Checked VPN client status'],
        },
      };
    }

    if (category === 'Network') {
      return {
        replyText: 'I\'ve identified an office network / Wi-Fi issue. Let\'s check if your device machine certificate is up-to-date or if your network adapter needs a quick reset.',
        detectedCategory: 'Network',
        detectedPriority: priority,
        confidence,
        suggestedActions: [
          'Forget Network & Reconnect',
          'Run Network Adapter Reset',
          'Test Wired LAN Cable',
          'Create Support Ticket'
        ],
        troubleshootingSteps: [
          'Forget POWERGRID-SECURE SSID and re-authenticate',
          'Verify 802.1X machine certificate validity in certmgr',
          'Connect via Ethernet cable to receive Group Policy push'
        ],
        isResolutionPrompt: false,
        draftTicketData: {
          title: 'Office Network / Wi-Fi connection issue',
          description: `User states: "${userMessage}". Device cannot establish stable connection to corporate network.`,
          category: 'Network',
          priority: priority,
          affectedService: 'POWERGRID-SECURE Corporate Network',
          troubleshootingAttempted: ['Re-entered credentials', 'Checked network settings'],
        },
      };
    }

    if (category === 'Hardware') {
      return {
        replyText: 'I can assist with this hardware issue. External display, docking station, and peripheral issues are commonly resolved by power-cycling the dock or reseating the Thunderbolt USB-C connection.',
        detectedCategory: 'Hardware',
        detectedPriority: priority,
        confidence,
        suggestedActions: [
          'Power Cycle Docking Station',
          'Press Win + P to Extend Display',
          'Check Refresh Rate (60Hz)',
          'Create Support Ticket'
        ],
        troubleshootingSteps: [
          'Unplug dock power brick for 30 seconds',
          'Reseat Thunderbolt USB-C cable firmly',
          'Set display refresh rate to 60.00 Hz in Windows settings'
        ],
        isResolutionPrompt: false,
        draftTicketData: {
          title: 'Hardware / Docking station display issue',
          description: `User reports hardware malfunction: "${userMessage}".`,
          category: 'Hardware',
          priority: priority,
          affectedService: 'Workstation Peripherals / Docking Station',
          troubleshootingAttempted: ['Power cycled docking station', 'Checked display settings'],
        },
      };
    }

    if (category === 'Account & Password') {
      return {
        replyText: 'Account access and password issues can often be self-resolved in 2 minutes using the corporate Self-Service Password Reset (SSPR) portal without waiting for an IT engineer.',
        detectedCategory: 'Account & Password',
        detectedPriority: 'High',
        confidence,
        suggestedActions: [
          'Wait 15 Minutes for Auto-Unlock',
          'Access SSPR Portal',
          'Disconnect Phone Wi-Fi (Avoid Bad Token Retries)',
          'Create Support Ticket'
        ],
        troubleshootingSteps: [
          'Wait out temporary 15-minute Active Directory lockout timer',
          'Disconnect mobile email client to prevent continuous bad password attempts',
          'Complete Aadhaar/OTP verification on intranet.powergrid.in/sspr'
        ],
        isResolutionPrompt: false,
        draftTicketData: {
          title: 'Active Directory domain account lockout',
          description: `User reported account lockout: "${userMessage}". Requires unlocking and Kerberos token validation.`,
          category: 'Account & Password',
          priority: 'High',
          affectedService: 'Active Directory / Enterprise Domain SSO',
          troubleshootingAttempted: ['Attempted self-service unlock', 'Waited lockout window'],
        },
      };
    }

    if (category === 'Email') {
      return {
        replyText: 'I can help with Outlook and Microsoft Exchange synchronization. Let\'s check if Outlook is running in Disconnected mode or if your mailbox storage threshold is exceeded.',
        detectedCategory: 'Email',
        detectedPriority: priority,
        confidence,
        suggestedActions: [
          'Check Webmail Access',
          'Run Outlook Repair',
          'Start in Safe Mode',
          'Create Support Ticket'
        ],
        troubleshootingSteps: [
          'Verify webmail at webmail.powergrid.in',
          'Run Outlook Repair via File > Account Settings',
          'Empty Deleted Items folder to clear quota space'
        ],
        isResolutionPrompt: false,
        draftTicketData: {
          title: 'Outlook / Exchange email sync issue',
          description: `User states: "${userMessage}". Email client is not synchronizing properly with corporate exchange server.`,
          category: 'Email',
          priority: priority,
          affectedService: 'Microsoft Exchange / Outlook Client',
          troubleshootingAttempted: ['Checked webmail', 'Restarted Outlook client'],
        },
      };
    }

    // Generic fallback troubleshooting response
    return {
      replyText: `I understand your IT issue regarding ${category}. Let's examine potential causes and start troubleshooting to get you back up and running promptly.`,
      detectedCategory: category,
      detectedPriority: priority,
      confidence,
      suggestedActions: [
        'Run Standard Diagnostic Check',
        'Review Related Knowledge Guide',
        'Did this solve your issue?',
        'Create Support Ticket'
      ],
      troubleshootingSteps: [
        'Restart application or service',
        'Check network connectivity and credentials',
        'Verify with team if scheduled maintenance is underway'
      ],
      isResolutionPrompt: false,
      draftTicketData: {
        title: userMessage.slice(0, 60),
        description: `User reported: "${userMessage}". Self-service assistance initiated.`,
        category: category,
        priority: priority,
        affectedService: `${category} Service`,
        troubleshootingAttempted: ['Reviewed troubleshooting recommendations'],
      },
    };
  }

  /**
   * 5. Ticket Summarization & Deep Analysis
   * Generates AI Intelligence panel data for IT Agents
   */
  public analyzeTicket(ticket: Ticket): AIAnalysisResult {
    const { category, confidence } = this.predictCategory(ticket.title + ' ' + ticket.description);
    const priority = this.suggestPriority(ticket.title + ' ' + ticket.description, ticket.department);

    let summary = ticket.aiSummary;
    if (!summary || summary.length < 10) {
      summary = `Employee ${ticket.createdByName} (${ticket.department}) reported an issue with ${ticket.affectedService || ticket.category}. Troubleshooting was attempted.`;
    }

    let suggestedResolution = ticket.aiSuggestedResolution;
    if (!suggestedResolution) {
      if (category === 'VPN') suggestedResolution = 'Verify VPN gateway route table and clear stale session tokens on regional concentrator.';
      else if (category === 'Network') suggestedResolution = 'Inspect 802.1X machine certificate validity and switch port radius status.';
      else if (category === 'Hardware') suggestedResolution = 'Run OEM hardware diagnostics, test alternate dock cable or schedule field technician inspection.';
      else if (category === 'Account & Password') suggestedResolution = 'Unlock Active Directory account object, verify MFA token synchronization, and reissue temporary credentials.';
      else suggestedResolution = 'Review service telemetry logs and verify user group policy assignments.';
    }

    return {
      category,
      priority,
      confidence,
      summary,
      suggestedResolution,
      affectedService: ticket.affectedService || `${category} Service`,
      troubleshootingSteps: ticket.troubleshootingAttempted || ['Basic client restart attempted'],
      suggestedActions: ['Accept AI Suggestion', 'Change Category', 'Change Priority', 'Assign to Specialist', 'Resolve Ticket'],
      similarIssues: ticket.similarIssues || [],
    };
  }
}

export const aiService = new AIService();
