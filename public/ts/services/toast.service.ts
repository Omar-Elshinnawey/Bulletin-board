import { Injectable, ViewContainerRef } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class ToastService {

    constructor(public toastr: ToastrService) {
    }

    success(message: string){
        this.toastr.clear();
        this.toastr.success(message);
    }

    error(message: string){
        this.toastr.clear();        
        this.toastr.error(message);
    }

    warning(message: string){
        this.toastr.clear();        
        this.toastr.warning(message);
    }

    info(message: string){
        this.toastr.clear();        
        this.toastr.info(message);
    }
}