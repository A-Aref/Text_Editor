package dev.texteditor.WebSocket;

// import java.util.List;

import org.springframework.context.annotation.Configuration;
// import org.springframework.http.codec.CodecConfigurer.DefaultCodecs;
// import org.springframework.messaging.converter.DefaultContentTypeResolver;
// import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
// import org.springframework.util.MimeTypeUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;




@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(@SuppressWarnings("null") StompEndpointRegistry registry) {
        registry.addEndpoint("/api").setAllowedOrigins("*");
        registry.addEndpoint("/api").setAllowedOrigins("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(@SuppressWarnings("null") MessageBrokerRegistry registry){
        registry.enableSimpleBroker("/topic","/user");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix(("/user"));
    }

    // @Override
    // public boolean configureMessageConverters(List<MessageConverter> messageConverters){

    //     DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
    //     resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON);

    //     return false;
    // }
}
