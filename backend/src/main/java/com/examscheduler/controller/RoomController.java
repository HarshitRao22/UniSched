package com.examscheduler.controller;

import com.examscheduler.dto.RoomDTO;
import com.examscheduler.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rooms")
@Tag(name = "Rooms", description = "Room management endpoints")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    @Operation(summary = "Get all rooms")
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by id")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total room count")
    public ResponseEntity<Map<String, Long>> getTotalRooms() {
        return ResponseEntity.ok(Map.of("total", roomService.getTotalRooms()));
    }

    @PostMapping
    @Operation(summary = "Create a new room")
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody RoomDTO dto) {
        RoomDTO created = roomService.createRoom(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing room")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomDTO dto) {
        return ResponseEntity.ok(roomService.updateRoom(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a room")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
