export interface createGroupRequest{
    name: string;
    imageSrc: string; 
    isPublic: boolean;
    startDate: Date
    endDate?: Date;
}