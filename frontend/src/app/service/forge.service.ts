import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ForgeMetadata } from '../model/forge.modal';
import { Observable } from 'rxjs';

declare var Autodesk;

@Injectable({
  providedIn: 'root'
})
export class ForgeService {
  constructor(public http: HttpClient, public spinner: NgxSpinnerService) {}

  private getForgeToken(callback) {
    this.http.get(environment.apiBaseUrl + '/admin/part/oauth/forge').subscribe((data: any) => {
      callback(data.access_token, data.expires_in);
    });
  }

  // initialize
  // tslint:disable-next-line:variable-name
  public initViewer(wrapper: Element, urn, access_token) {
    const options = {
      env: 'AutodeskProduction',
      getAccessToken: () => access_token
    };

    let viewer;

    function onDocumentLoadSuccess(doc) {
      const viewables = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, viewables).then(i => {
        // documented loaded, any action?
      });
    }

    function onDocumentLoadFailure(viewerErrorCode) {
      console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    }

    Autodesk.Viewing.Initializer(options, () => {
      viewer = new Autodesk.Viewing.GuiViewer3D(wrapper, { extensions: ['Autodesk.DocumentBrowser'] });
      viewer.start();
      const documentId = 'urn:' + urn;
      Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    });
  }

  public start(wrapper: Element, urn: string) {
    // tslint:disable-next-line:variable-name
    this.getForgeToken((access_token: any, expires_in: any) => {
      this.getManifest(wrapper, urn, access_token);
    });
  }

  // tslint:disable-next-line:variable-name
  public getManifest(wrapper: Element, urn: string, access_token) {
    const url = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest';
    this.http
      .get(url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + access_token
        })
      })
      .toPromise()
      .then((res: any) => {
        if (res.status === 'success') {
          this.spinner.hide();
          this.initViewer(wrapper, urn, access_token);
        } else {
          setTimeout(() => {
            this.getManifest(wrapper, urn, access_token);
          }, 1000);
        }
      });
  }

  public getMetadataId(connectorServiceId: number): Observable<ForgeMetadata> {
    return this.http.get<ForgeMetadata>(
      environment.apiBaseUrl + '/admin/part/3Dimage?metadataId=' + connectorServiceId
    );
  }
}
