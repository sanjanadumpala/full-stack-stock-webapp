export interface Item {
    company_info: any[];
    stock_info: any[];
    peer_info: any[];
    graph_info: any[];
    news_info: any[];
    trend_info: any[];
    sentiment_info: any[];
    earning_info: any[];
    watchlist_info: any[];
    watchlist_check_info: any[];
    portfolio_info: any[];
    portfolio_check_info: any[];
    wallet_info: any[];
    graph_info2: any[];
    formValue: string;
    suggestions: any[];
    isContentLoading: boolean;
    isLoading: boolean;
    initialLoading: boolean;
    showBaseInfo: boolean;
    activeMenuItem: string;
    ticker: string;
    IsMarketOpen: boolean;
    watchlistToggle: boolean;
    caretStyle: string;
    showAddAlert: boolean;
    showRemoveAlert: boolean;
    showPAddAlert: boolean;
    showPRemoveAlert: boolean;
    currentPrice: number;
    moneyInWallet: string;
    inputValue: number;
    showInvalidAlert: boolean;
    t: string;
    newTime: string;
    wColor: { color: string };
    wStyle: string;
    cSell: boolean;
}