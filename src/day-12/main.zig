const std = @import("std");

const MoveType = enum {
    ship,
    waypoint,
};

const Ferry = struct {
    x: i64,
    y: i64,
    waypoint_x: i64,
    waypoint_y: i64,

    fn move(self: *Ferry, dx: i64, dy: i64, steps: i64, navigation_type: MoveType) void {
        var x_ptr = if (navigation_type == .ship) &self.x else &self.waypoint_x;
        var y_ptr = if (navigation_type == .ship) &self.y else &self.waypoint_y;

        x_ptr.* += dx * steps;
        y_ptr.* += dy * steps;
    }

    fn rotate(self: *Ferry, rot_y: i64, degrees: i64) void {
        std.debug.assert(@mod(degrees, 90) == 0);
        var to_rotate = degrees;
        while (to_rotate > 0) : (to_rotate -= 90) {
            const old_waypoint_x = self.waypoint_x;
            self.waypoint_x = -self.waypoint_y * rot_y;
            self.waypoint_y = old_waypoint_x * rot_y;
        }
    }

    fn distance_to_start(self: *Ferry) i64 {
        return (std.math.absInt(self.x) catch unreachable) + (std.math.absInt(self.y) catch unreachable);
    }
};

fn navigate(input: []const u8, navigation_type: MoveType) i64 {
    var it = std.mem.tokenize(input, "\n");
    var ferry = Ferry{
        .x = 0,
        .y = 0,
        .waypoint_x = if (navigation_type == .ship) 1 else 10,
        .waypoint_y = if (navigation_type == .ship) 0 else 1,
    };
    while (it.next()) |line| {
        const cmd = line[0];
        const arg = std.fmt.parseInt(i64, line[1..], 10) catch unreachable;
        switch (cmd) {
            'N' => ferry.move(0, 1, arg, navigation_type),
            'S' => ferry.move(0, -1, arg, navigation_type),
            'E' => ferry.move(1, 0, arg, navigation_type),
            'W' => ferry.move(-1, 0, arg, navigation_type),
            'L' => ferry.rotate(1, arg),
            'R' => ferry.rotate(-1, arg),
            'F' => ferry.move(ferry.waypoint_x, ferry.waypoint_y, arg, MoveType.ship),
            else => unreachable,
        }
    }
    return ferry.distance_to_start();
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();

    var input = try std.fs.cwd().readFileAlloc(&gpa.allocator, "12.txt", std.math.maxInt(usize));
    defer gpa.allocator.free(input);

    std.debug.print("EASY: {}\n", .{navigate(input, MoveType.ship)});
    std.debug.print("HARD: {}\n", .{navigate(input, MoveType.waypoint)});
}
