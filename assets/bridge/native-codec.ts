export interface Codec{
    decode<T>(content:string) : T
    encode<T>(t:T):string
}

export class NativeCodec implements Codec {

    decode<T>(message: string): T {
        return JSON.parse(message) as T;
    }

    encode<T>(t?: T): string | null {
        if (t == null) {
            return null;
        }
        return JSON.stringify(t);
    }

}