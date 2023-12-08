import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ApiUrls } from "../CommonUtility/apiUrls";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpResponse } from 'selenium-webdriver/http';
import { LanguageService } from "./language.service";
import { CommonService } from "./common.service";
import { MemoryService } from "./memory.service";

@Injectable()
export class HttpService {

    constructor(private _http: HttpClient, private _memoryService: MemoryService) {

    }

    getDataFromServer(apiURL: string, authtoken: string, body: any): Observable<HttpResponse> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        let languageCode = this._memoryService.getLanguageCode();
        body['LanguageCode'] = languageCode
        let model = this._transformRequest(body);
        return this._http.post(ApiUrls.BaseURL + apiURL, model, httpOptions);
    }

    // getDataFromServer(apiURL: string, authtoken: string, body: any) {
    //     var headers = new Headers();
    //     headers.append("Content-Type", "application/x-www-form-urlencoded");
    //     var requestOptions = new RequestOptions({
    //         headers: headers
    //     });
    //     let model = this._transformRequest(body);
    //     return this._http.post(ApiUrls.BaseURL + apiURL, model, requestOptions)
    //         .map((response: Response) => response.json())
    //         .catch(this._errorHandler);
    // }

    private _errorHandler(error: Response) {
        return "Problem in service please try again after some time;"
    }

    private _transformRequest(obj: any): any {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }

    private _setCORSHeaders(headers: Headers, authtoken: string): Headers {
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append("Authorization", 'Bearer ' + authtoken);
        return headers;
    }
}