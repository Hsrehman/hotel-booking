import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  TassProDestinationInfo,
  TassProHotelInfo,
  TassProSearchRequest,
  TassProSearchResponse,
  TassProRoomDetailRequest,
  TassProRoomDetailResponse,
  TassProBookingRequest,
  TassProBookingResponse,
  SearchParams,
  RoomConfig,
} from '@/types';

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

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[TassPro API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[TassPro API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
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

  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      console.error(`[TassPro API] Error calling ${endpoint}:`, error);
      throw new Error(`API call failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Static Content APIs
  async destinationInfo(destination: string): Promise<TassProDestinationInfo[]> {
    const data = { destination };
    const response = await this.makeRequest<any>('/destination-info', data);
    return response.data || [];
  }

  async hotelsInfoByDestination(destinationId: string): Promise<any[]> {
    const data = { destinationId };
    const response = await this.makeRequest<any>('/HotelsInfoByDestinationId', data);
    return response.hotelsInformation || [];
  }

  async hotelInfo(hotelCode: string): Promise<TassProHotelInfo> {
    const data = { hotelCode };
    const response = await this.makeRequest<any>('/hotel-Info', data);
    return response.hotelInformation;
  }

  async countryInfo(countryCode: string): Promise<Array<{ key: string; value: string }>> {
    const data = { countryCode };
    const response = await this.makeRequest<any>('/country-info', data);
    return response.data || [];
  }

  // Hotel Service APIs
  async hotelSearch(params: SearchParams): Promise<TassProSearchResponse> {
    const requestData: TassProSearchRequest = {
      SearchParameter: {
        DestinationCode: params.destinationCode,
        CountryCode: params.countryCode,
        Nationality: params.nationality,
        Currency: params.currency,
        CheckInDate: params.checkIn,
        CheckOutDate: params.checkOut,
        Rooms: {
          Room: params.rooms.map(room => ({
            RoomIdentifier: room.roomIdentifier,
            Adult: room.adults,
            Children: room.children.length > 0 ? {
              Count: room.children.length,
              ChildAge: room.children.map((child, index) => ({
                Identifier: index + 1,
                Text: child.age.toString(),
              })),
            } : undefined,
          })),
        },
        TassProInfo: {
          CustomerCode: this.customerCode,
          RegionID: this.regionId,
        },
      },
    };

    return await this.makeRequest<TassProSearchResponse>('/Search', requestData);
  }

  async roomDetails(sessionId: string, hotelCode: string, rooms: RoomConfig[]): Promise<TassProRoomDetailResponse> {
    const requestData: TassProRoomDetailRequest = {
      SessionId: sessionId,
      SearchParameter: {
        HotelCode: hotelCode,
        Currency: 'AED', // Default currency, should be passed as parameter
        Rooms: {
          Room: rooms.map(room => ({
            RoomIdentifier: room.roomIdentifier,
            Adult: room.adults,
            Children: room.children.length > 0 ? {
              Count: room.children.length,
              ChildAge: room.children.map((child, index) => ({
                Identifier: index + 1,
                Text: child.age.toString(),
              })),
            } : undefined,
          })),
        },
      },
    };

    return await this.makeRequest<TassProRoomDetailResponse>('/RoomDetails', requestData);
  }

  async priceBreakup(sessionId: string, hotelCode: string, groupCode: number, rateKeys: string[]): Promise<any> {
    const data = {
      SessionId: sessionId,
      SearchParameter: {
        HotelCode: hotelCode,
        GroupCode: groupCode,
        Currency: 'AED',
        RateKeys: {
          RateKey: rateKeys,
        },
      },
    };

    return await this.makeRequest<any>('/PriceBreakup', data);
  }

  async cancellationPolicy(sessionId: string, hotelCode: string, groupCode: number, rateKeys: string[]): Promise<any> {
    const data = {
      SessionId: sessionId,
      SearchParameter: {
        HotelCode: hotelCode,
        GroupCode: groupCode,
        Currency: 'AED',
        RateKeys: {
          RateKey: rateKeys,
        },
      },
    };

    return await this.makeRequest<any>('/CancellationPolicy', data);
  }

  async preBook(sessionId: string, hotelCode: string, groupCode: number, rateKeys: string[]): Promise<any> {
    const data = {
      SessionId: sessionId,
      SearchParameter: {
        HotelCode: hotelCode,
        GroupCode: groupCode,
        Currency: 'AED',
        RateKeys: {
          RateKey: rateKeys,
        },
      },
    };

    return await this.makeRequest<any>('/PreBook', data);
  }

  async book(bookingDetails: TassProBookingRequest): Promise<TassProBookingResponse> {
    return await this.makeRequest<TassProBookingResponse>('/Book', bookingDetails);
  }

  async cancel(sessionId: string, adsConfirmationNumber: string): Promise<any> {
    const data = {
      SessionId: sessionId,
      Currency: 'AED',
      ADSConfirmationNumber: adsConfirmationNumber,
      CancelRooms: {
        CancelRoom: [], // Empty array for full booking cancellation
      },
    };

    return await this.makeRequest<any>('/Cancel', data);
  }

  async bookingDetails(sessionId: string, adsConfirmationNumber: string): Promise<any> {
    const data = {
      SessionId: sessionId,
      ADSConfirmationNumber: adsConfirmationNumber,
    };

    return await this.makeRequest<any>('/BookingDetails', data);
  }
}

export const tassProApi = new TassProApiClient();

