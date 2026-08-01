package com.examscheduler.service;

import com.examscheduler.dto.RoomDTO;
import com.examscheduler.entity.Room;
import com.examscheduler.exception.DuplicateResourceException;
import com.examscheduler.exception.ResourceNotFoundException;
import com.examscheduler.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return convertToDTO(room);
    }

    public RoomDTO createRoom(RoomDTO dto) {
        if (roomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            throw new DuplicateResourceException("Room number already exists: " + dto.getRoomNumber());
        }

        Room room = Room.builder()
                .roomNumber(dto.getRoomNumber())
                .capacity(dto.getCapacity())
                .building(dto.getBuilding())
                .build();

        Room saved = roomRepository.save(room);
        return convertToDTO(saved);
    }

    public RoomDTO updateRoom(Long id, RoomDTO dto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (!room.getRoomNumber().equals(dto.getRoomNumber())
                && roomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            throw new DuplicateResourceException("Room number already exists: " + dto.getRoomNumber());
        }

        room.setRoomNumber(dto.getRoomNumber());
        room.setCapacity(dto.getCapacity());
        room.setBuilding(dto.getBuilding());

        Room updated = roomRepository.save(room);
        return convertToDTO(updated);
    }

    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
    }

    public long getTotalRooms() {
        return roomRepository.count();
    }

    private RoomDTO convertToDTO(Room room) {
        return RoomDTO.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .capacity(room.getCapacity())
                .building(room.getBuilding())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }
}
