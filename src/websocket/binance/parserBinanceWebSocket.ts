
export function processDataForType(type: string) {
    if (type === 'trade') {
      return processTradeData;
    } else if (type === 'orderbook') {
      return processOrderBookData;
    }
  
    return (rawData: string) => rawData;
  }

function processTradeData(rawData: string): string {
    try {
        // Assuming the rawData is a JSON string
        const data = JSON.parse(rawData);
        // Example processing: let's say we just log the data and return it as-is
        //console.log("Received data:", data);

        // Check if the data contains the 'price' field and it's a string
        if (data.p && typeof data.p === 'string') {
            // Convert the price to a number, add 100, and then convert it back to a string
            const priceNumber = parseFloat(data.p);
            data.p = (priceNumber + 2000).toString();
        }

        // Convert the processed data back to a string if necessary
        return JSON.stringify(data);
    } catch (error) {
        if (error instanceof Error) {
            // Now it's safe to access the 'message' property
            console.error("Error processing data:", error.message);
            return `Error processing data: ${error.message}`;
        } else {
            // Handle cases where the caught object is not an Error instance
            console.error("An unknown error occurred");
            return "An unknown error occurred";
        }
    }
}

function processOrderBookData(rawData: string): string {
    // Assuming the rawData is a JSON string
    const data = JSON.parse(rawData);
    //console.log("Received orderbook data", data)
    return rawData;
}