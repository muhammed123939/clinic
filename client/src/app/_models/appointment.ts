import { Time } from "@angular/common"

export interface Appointment {
    id: number
    doctorId: number
    adminId: number
    patientId: number
    date: Date
    time: Time
    patientcase : string 
    patientcomment : string 
}
