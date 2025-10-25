import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  DestinationInfoRequest,
  DestinationInfoResponse,
  HotelsInfoByDestinationIdRequest,
  HotelsInfoByDestinationIdResponse,
  HotelInfoRequest,
  HotelInfoResponse,
  CountryInfoRequest,
  CountryInfoResponse,
  HotelSearchRequest,
  HotelSearchResponse,
  RoomDetailRequest,
  RoomDetailResponse,
  PriceBreakupRequest,
  PriceBreakupResponse,
  CancellationPolicyRequest,
  CancellationPolicyResponse,
  PreBookRequest,
  PreBookResponse,
  BookingRequest,
  BookingResponse,
  CancellationRequest,
  CancellationResponse,
  BookingDetailsRequest,
  BookingDetailsResponse,
  TassProApiResponse,
} from '@/types/tasspro';

export class TassProApiClient {
  private client: AxiosInstance;
  private apiKey: string;
  private customerCode: string;
  private regionId: string;

  constructor() {
    this.apiKey = process.env.TASSPRO_API_KEY || '';
    this.customerCode = process.env.TASSPRO_CUSTOMER_CODE || '';
    this.regionId = process.env.TASSPRO_REGION_ID || '';

    this.client = axios.create({
      baseURL: process.env.TASSPRO_API_BASE_URL || 'http://uat-apiv2.giinfotech.ae/api/v2/hotel',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for logging and API key
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[TassPro API] ${config.method?.toUpperCase()} ${config.url}`);
        
        // Add API key to request headers
        if (this.apiKey) {
          config.headers['apikey'] = this.apiKey;
        }
        
        return config;
      },
      (error) => {
        console.error('[TassPro API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[TassPro API] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[TassPro API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private async makeRequest<T>(
    endpoint: string,
    data: any,
    method: 'GET' | 'POST' = 'POST'
  ): Promise<TassProApiResponse<T>> {
    try {
      const response: AxiosResponse<TassProApiResponse<T>> = await this.client({
        method,
        url: endpoint,
        data: method === 'POST' ? data : undefined,
        params: method === 'GET' ? data : undefined,
      });

      return response.data;
    } catch (error: any) {
      console.error(`[TassPro API] Error calling ${endpoint}:`, error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        throw new Error(`API Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error: No response from server');
      } else {
        // Something else happened
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  /**
   * Get destination information by destination name
   */
  async destinationInfo(request: DestinationInfoRequest): Promise<TassProApiResponse<DestinationInfoResponse[]>> {
    return this.makeRequest<DestinationInfoResponse[]>('/destination-info', request);
  }

  /**
   * Get hotels by destination ID
   */
  async hotelsInfoByDestinationId(request: HotelsInfoByDestinationIdRequest): Promise<TassProApiResponse<HotelsInfoByDestinationIdResponse[]>> {
    return this.makeRequest<HotelsInfoByDestinationIdResponse[]>('/HotelsInfoByDestinationId', request);
  }

  /**
   * Get hotel information by hotel code
   */
  async hotelInfo(request: HotelInfoRequest): Promise<TassProApiResponse<HotelInfoResponse>> {
    return this.makeRequest<HotelInfoResponse>('/hotel-Info', request);
  }

  /**
   * Get country information by country code
   */
  async countryInfo(request: CountryInfoRequest): Promise<TassProApiResponse<CountryInfoResponse[]>> {
    return this.makeRequest<CountryInfoResponse[]>('/country-info', request);
  }

  /**
   * Search for hotels
   */
  async hotelSearch(request: HotelSearchRequest): Promise<TassProApiResponse<HotelSearchResponse>> {
    return this.makeRequest<HotelSearchResponse>('/Search', request);
  }

  /**
   * Get room details for a specific hotel
   */
  async roomDetails(request: RoomDetailRequest): Promise<TassProApiResponse<RoomDetailResponse>> {
    return this.makeRequest<RoomDetailResponse>('/RoomDetails', request);
  }

  /**
   * Get price breakdown for specific rate keys
   */
  async priceBreakup(request: PriceBreakupRequest): Promise<TassProApiResponse<PriceBreakupResponse>> {
    return this.makeRequest<PriceBreakupResponse>('/PriceBreakup', request);
  }

  /**
   * Get cancellation policy for specific rate keys
   */
  async cancellationPolicy(request: CancellationPolicyRequest): Promise<TassProApiResponse<CancellationPolicyResponse>> {
    return this.makeRequest<CancellationPolicyResponse>('/CancellationPolicy', request);
  }

  /**
   * Pre-book validation (check availability and price)
   */
  async preBook(request: PreBookRequest): Promise<TassProApiResponse<PreBookResponse>> {
    return this.makeRequest<PreBookResponse>('/PreBook', request);
  }

  /**
   * Create a booking
   */
  async book(request: BookingRequest): Promise<TassProApiResponse<BookingResponse>> {
    return this.makeRequest<BookingResponse>('/Book', request);
  }

  /**
   * Cancel a booking
   */
  async cancel(request: CancellationRequest): Promise<TassProApiResponse<CancellationResponse>> {
    return this.makeRequest<CancellationResponse>('/Cancel', request);
  }

  /**
   * Get booking details
   */
  async bookingDetails(request: BookingDetailsRequest): Promise<TassProApiResponse<BookingDetailsResponse>> {
    return this.makeRequest<BookingDetailsResponse>('/BookingDetails', request);
  }

  /**
   * Generate a unique customer reference number
   */
  generateCustomerRefNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TSSPRO-${timestamp}${random}`.toUpperCase();
  }

  /**
   * Validate session ID format
   */
  isValidSessionId(sessionId: string): boolean {
    return Boolean(sessionId && sessionId.length > 0);
  }

  /**
   * Validate hotel code format
   */
  isValidHotelCode(hotelCode: string): boolean {
    return Boolean(hotelCode && /^\d+$/.test(hotelCode));
  }

  /**
   * Validate destination ID format
   */
  isValidDestinationId(destinationId: string): boolean {
    return Boolean(destinationId && /^\d+-\d+$/.test(destinationId));
  }

  /**
   * Validate rate key format
   */
  isValidRateKey(rateKey: string): boolean {
    return Boolean(rateKey && rateKey.length > 0);
  }

  /**
   * Validate currency code format
   */
  isValidCurrency(currency: string): boolean {
    const validCurrencies = ['AED', 'USD', 'EUR', 'GBP'];
    return validCurrencies.includes(currency.toUpperCase());
  }

  /**
   * Validate country code format
   */
  isValidCountryCode(countryCode: string): boolean {
    return Boolean(countryCode && countryCode.length === 2 && /^[A-Z]{2}$/.test(countryCode));
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  /**
   * Validate room configuration
   */
  isValidRoomConfiguration(rooms: any[]): boolean {
    if (!Array.isArray(rooms) || rooms.length === 0 || rooms.length > 6) {
      return false;
    }

    return rooms.every(room => {
      return room.RoomIdentifier &&
             room.Adult >= 1 && room.Adult <= 9 &&
             (!room.Children || 
              (room.Children.Count >= 0 && room.Children.Count <= 4 &&
               (!room.Children.ChildAge || 
                room.Children.ChildAge.every((child: any) => 
                  child.Identifier && child.Text && 
                  parseInt(child.Text) >= 1 && parseInt(child.Text) <= 17
                )
               )
              )
             );
    });
  }
}

// Export singleton instance
export const tassProApi = new TassProApiClient();
