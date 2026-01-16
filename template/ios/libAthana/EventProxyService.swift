//
//  EventProxyService.swift
//  Athana Demo
//
//  Created by CWJoy on 16/12/2025.
//
import AthanaCore
import AthanaSDK

struct EventProxyService: SDKService {
    
    let methodSendEvent = "sendEvent"
    
    func initialize() {
        CocosEventDispatcher.shared.register(
            methodSendEvent,
            listener: { data in
                guard let param = data else {
                    return
                }
                
                let event = EventsUtils.buildEvent(param.key, params: param.params?.toDict(), type: param.type)
                Athana.shared.logEvent(event: event)
            },
            codec: JSONCodec<Event>()
        )
    }
    
}

struct Event: Codable {
    let key: String
    let params: [String: AnyCodable]?
    let type: String
}
