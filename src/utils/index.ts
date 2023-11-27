import axios from 'axios'

export const getPrice = async (symbol: string) => {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`)
    return response?.data?.[symbol]?.usd || 0
}

export const toOptionalFixed = (num: number, digits: number = 9) =>
  `${Number.parseFloat(num.toFixed(digits))}`;