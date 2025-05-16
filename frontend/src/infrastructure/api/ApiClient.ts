import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';


export class ApiClient {
 private client: AxiosInstance;
  constructor() {
   this.client = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
     headers: {
       'Content-Type': 'application/json',
     },
   });
  
   // Interceptores para manejo de tokens, errores, etc.
   this.setupInterceptors();
 }
  private setupInterceptors() {
   // Interceptor de solicitud
   this.client.interceptors.request.use(
     (config) => {
       // Aquí podrías agregar tokens de autenticación, etc.
       return config;
     },
     (error) => {
       return Promise.reject(error);
     }
   );
  
   // Interceptor de respuesta
   this.client.interceptors.response.use(
     (response) => {
       return response;
     },
     (error) => {
       // Manejo centralizado de errores
       if (error.response) {
         // Error de respuesta del servidor
         console.error('Error de respuesta:', error.response.data);
       } else if (error.request) {
         // Error de solicitud (sin respuesta)
         console.error('Error de solicitud:', error.request);
       } else {
         // Error en la configuración
         console.error('Error:', error.message);
       }
      
       return Promise.reject(error);
     }
   );
 }
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
   const response = await this.client.get<T>(url, config);
   return response.data;
 }
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
   const response = await this.client.post<T>(url, data, config);
   return response.data;
 }
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
   const response = await this.client.put<T>(url, data, config);
   return response.data;
 }
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
   const response = await this.client.delete<T>(url, config);
   return response.data;
 }
}
